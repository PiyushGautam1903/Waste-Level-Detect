export const ARDUINO_CODE = `const int trigPin = 9;
const int echoPin = 10;

// You can adjust this based on actual jar/bin height
const float wasteBinHeight = 22.5;  // in cm

long duration = 0;
float distanceCM = 0;
float fillLevel = 0;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.begin(9600);  // Initialize Serial Monitor
}

void loop() {
  // --- Take multiple samples for smoothing ---
  float totalDistance = 0;
  const int samples = 5;

  for (int i = 0; i < samples; i++) {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    duration = pulseIn(echoPin, HIGH, 30000);  // Timeout after 30ms (~5m range)
    float singleDistance = duration * 0.0343 / 2;  // Convert to cm

    totalDistance += singleDistance;
    delay(50);  // Small delay between readings
  }

  // --- Calculate average distance ---
  distanceCM = totalDistance / samples;

  // --- Check if distance is within expected range ---
  if (distanceCM < 0 || distanceCM > wasteBinHeight) {
    distanceCM = -1;
    fillLevel = -1;
  } else {
    fillLevel = 100.0 * (wasteBinHeight - distanceCM) / wasteBinHeight;
    fillLevel = constrain(fillLevel, 0, 100);  // Clamp to 0–100%
  }

  // --- Serial Output ---
  Serial.print("Distance: ");
  if (distanceCM == -1) {
    Serial.println("Out of range");
  } else {
    Serial.print(distanceCM, 2);
    Serial.println(" cm");
  }

  Serial.print("Fill level: ");
  if (fillLevel == -1) {
    Serial.println("Invalid");
  } else {
    Serial.print(fillLevel, 1);
    Serial.println(" %");
  }

  delay(500);  // Sample every 0.5 seconds
}`;
