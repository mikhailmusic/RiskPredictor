from features import ALL_FEATURES

def validate_input(data: dict, allowed: dict) -> tuple[bool, str]:
    missing = [f for f in ALL_FEATURES if f not in data or data[f] is None]
    if missing:
        return False, f"Пропущены или пусты обязательные поля: {missing}"

    # weather
    if isinstance(data["weather"], list):
        invalid_weather = [w for w in data["weather"] if w not in allowed["weather"]]
    else:
        invalid_weather = [data["weather"]] if data["weather"] not in allowed["weather"] else []
    if invalid_weather:
        return False, f"Недопустимое значение в 'weather': {invalid_weather}"

    # road_conditions
    if isinstance(data["road_conditions"], list):
        invalid_rc = [r for r in data["road_conditions"] if r not in allowed["road_conditions"]]
    else:
        invalid_rc = [data["road_conditions"]] if data["road_conditions"] not in allowed["road_conditions"] else []
    if invalid_rc:
        return False, f"Недопустимое значение в 'road_conditions': {invalid_rc}"

    # Прочие категориальные поля
    for field in ["time_of_day", "driver_gender", "vehicle_color", "vehicle_category_grouped", "day_of_week"]:
        if data[field] not in allowed[field]:
            return False, f"Недопустимое значение в '{field}': {data[field]}"

    # Связь: марка → модель
    brand = data["vehicle_brand"]
    model = data["vehicle_model"]

    if brand not in allowed["vehicle_info"]:
        return False, f"Недопустимая марка: {brand}"
    if model not in allowed["vehicle_info"][brand]:
        return False, f"Модель '{model}' не соответствует марке '{brand}'"

    # vehicle_year
    vy = data["vehicle_year"]
    if not (allowed["vehicle_year"]["min"] <= vy <= allowed["vehicle_year"]["max"]):
        return False, f"vehicle_year {vy} вне допустимого диапазона"

    # vehicle_participants_count
    vpc = data["vehicle_participants_count"]
    if not (allowed["vehicle_participants_count"]["min"] <= vpc <= allowed["vehicle_participants_count"]["max"]):
        return False, f"vehicle_participants_count {vpc} вне допустимого диапазона"

    # driver_years_of_driving_experience
    exp = data["driver_years_of_driving_experience"]
    if not (allowed["driver_years_of_driving_experience"]["min"] <= exp <= allowed["driver_years_of_driving_experience"]["max"]):
        return False, f"driver_years_of_driving_experience {exp} вне допустимого диапазона"

    # point.lat и point.long
    lat, lon = data["point.lat"], data["point.long"]
    if not (allowed["point_lat"]["min"] <= lat <= allowed["point_lat"]["max"]):
        return False, f"point.lat {lat} вне допустимого диапазона"
    if not (allowed["point_long"]["min"] <= lon <= allowed["point_long"]["max"]):
        return False, f"point.long {lon} вне допустимого диапазона"

    return True, ""
