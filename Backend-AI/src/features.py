NUMERIC_FEATURES = [
    'point.lat',
    'point.long',
    'vehicle_year',
    'driver_years_of_driving_experience',
    'day_of_week',
    'vehicle_participants_count'
]

CATEGORICAL_FEATURES = [
    'weather',
    'road_conditions',
    'vehicle_brand',
    'vehicle_color',
    'vehicle_model',
    'vehicle_category_grouped',
    'time_of_day',
    'driver_gender'
]

ALL_FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES