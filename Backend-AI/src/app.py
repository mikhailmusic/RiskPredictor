from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from catboost import CatBoostRegressor
import os, json

from config import Config
from validation import validate_input
from features import NUMERIC_FEATURES, CATEGORICAL_FEATURES


app = Flask(__name__)
app.config.from_object(Config)
CORS(app, resources=app.config['CORS_RESOURCES'])

# === Loading models and preprocessors ===
model = CatBoostRegressor()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model.load_model(os.path.join(BASE_DIR, "models", "accident_risk_model.cbm"))
cat_encoder = joblib.load(os.path.join(BASE_DIR, "preprocessors", "catboost_encoder.pkl"))
num_scaler = joblib.load(os.path.join(BASE_DIR, "preprocessors", "standard_scaler.pkl"))

with open(os.path.join(BASE_DIR, "contract", "allowed_values.json"), encoding="utf-8") as f:
    allowed_values = json.load(f)


@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Empty or invalid input"}), 400
        
        # Renaming fields for model
        rename_keys = {
            "point_lat": "point.lat",
            "point_long": "point.long"
        }
        for old_key, new_key in rename_keys.items():
            if old_key in data:
                data[new_key] = data.pop(old_key)


        is_valid, error_message = validate_input(data, allowed_values)
        if not is_valid:
            return jsonify({"error": error_message}), 400

        df = pd.DataFrame([data])
        for col in ['weather', 'road_conditions']:
            df[col] = df[col].apply(lambda x: ', '.join(x) if isinstance(x, list) else x)

        X_num = num_scaler.transform(df[NUMERIC_FEATURES])
        X_cat = cat_encoder.transform(df[CATEGORICAL_FEATURES])
        X = np.hstack([X_num, X_cat])


        risk = model.predict(X)[0]
        return jsonify({"risk": float(risk)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/contract', methods=['GET'])
def get_contract():
    return  json.dumps(allowed_values, ensure_ascii=False)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
