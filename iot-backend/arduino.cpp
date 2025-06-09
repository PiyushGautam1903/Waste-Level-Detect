const int trigPin = 9;
const int echoPin = 10;

const float wasteBinHeight = 30;  // in cm

long duration = 0;
float distanceCM = 0;
float fillLevel = 0;
float previousDistance = wasteBinHeight;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.begin(9600);  // Initialize Serial Monitor
}

void loop() {
  float totalDistance = 0;
  const int samples = 5;

  for (int i = 0; i < samples; i++) {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    duration = pulseIn(echoPin, HIGH, 30000);  // Timeout after 30ms (~5m range)
    float singleDistance = duration * 0.0343 / 2;

    // --- Clamp out weird low-range jumps (like 800+ cm)
    if (singleDistance > 2 * wasteBinHeight && previousDistance < 2) {
      singleDistance = 0;  // Object too close, treat as "blocked"
    }

    totalDistance += singleDistance;
    delay(50);
  }

  distanceCM = totalDistance / samples;
  previousDistance = distanceCM;

  // --- Calculate fill level (but not applying logic)
  fillLevel = 100.0 * (wasteBinHeight - distanceCM) / wasteBinHeight;
  fillLevel = constrain(fillLevel, 0, 100);  // Clamp to 0–100%

  // --- Clean Serial Output ---
  Serial.print("Distance: ");
  Serial.println(distanceCM, 2);  // Always float
  Serial.print("Fill level: ");
  Serial.println(fillLevel, 1);  // Always float

  delay(2000);
}
