MAX_DEFAULT_DEPTH = 22.5
_depth_override_threshold = 3
new_depth_counter = 0
max_depth = MAX_DEFAULT_DEPTH

def process_distance(raw_distance):
    global max_depth, new_depth_counter

    if raw_distance > max_depth:
        new_depth_counter += 1
        if new_depth_counter >= _depth_override_threshold:
            max_depth = raw_distance
            new_depth_counter = 0
    else:
        new_depth_counter = 0

    # Clamp raw_distance to current max_depth
    distance = min(raw_distance, max_depth)
    fill_percent = max(0, min(100, ((max_depth - distance) / max_depth) * 100))

    print(f"Processed distance: {distance}, Max depth: {max_depth}, Fill percent: {fill_percent:.1f}%")

    return {
        "distance": round(distance, 2),
        "max_depth": round(max_depth, 2),
        "fill_percent": round(fill_percent, 1)
    }
