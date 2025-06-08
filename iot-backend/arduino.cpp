const int sensorPin = A0;      // IR sensor OUT pin connected to A0
const float wasteBinHeight = 15.0;  // Height of the wasteBin in cm (adjust as per your wasteBin)

int sensorValue = 0;
float distanceCM = 0;
float fillLevel = 0;

void setup() {
  Serial.begin(9600);  // Start serial communication at 9600 baud
}

void loop() {
  // --- Smooth the analog reading by averaging 10 samples ---
  long sum = 0;
  for (int i = 0; i < 10; i++) {
    sum += analogRead(sensorPin);
    delay(5);  // Small delay between samples
  }
  sensorValue = sum / 10;

  // --- Convert sensor reading to distance in cm ---
  // Empirical formula (approximate) for Sharp GP2Y0A21
  if (sensorValue > 20) {
    distanceCM = 4800.0 / (sensorValue - 20);  // Avoid divide-by-zero
  } else {
    distanceCM = -1;  // Invalid sensor reading
  }

  // --- Clamp distance if it's outside the expected range ---
  if (distanceCM < 0 || distanceCM > wasteBinHeight) {
    distanceCM = -1;  // Out of range
  }

  // --- Calculate fill level as percentage ---
  if (distanceCM != -1) {
    fillLevel = 100.0 * (wasteBinHeight - distanceCM) / wasteBinHeight;
    fillLevel = constrain(fillLevel, 0, 100);  // Ensure percentage is between 0–100
  } else {
    fillLevel = -1;  // Invalid
  }

  // --- Output result to Serial Monitor ---
  Serial.print("Distance: ");
  if (distanceCM == -1) {
    Serial.println("Out of range");
  } else {
    Serial.print(distanceCM);
    Serial.println(" cm");
  }

  Serial.print("Fill level: ");
  if (fillLevel == -1) {
    Serial.println("Invalid");
  } else {
    Serial.print(fillLevel);
    Serial.println(" %");
  }

  delay(500);  // Wait half a second before next reading
}
