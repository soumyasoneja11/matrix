package com.mediscan.dto;

public class StructuredSymptoms {

    private int heartRate;
    private double temperature;
    private int oxygenLevel;

    private boolean unconscious;
    private boolean chestPain;
    private boolean breathingDifficulty;

    // GETTERS

    public int getHeartRate() {
        return heartRate;
    }

    public double getTemperature() {
        return temperature;
    }

    public int getOxygenLevel() {
        return oxygenLevel;
    }

    public boolean isUnconscious() {
        return unconscious;
    }

    public boolean getChestPain() {
        return chestPain;
    }

    public boolean getBreathingDifficulty() {
        return breathingDifficulty;
    }

    // SETTERS

    public void setHeartRate(int heartRate) {
        this.heartRate = heartRate;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public void setOxygenLevel(int oxygenLevel) {
        this.oxygenLevel = oxygenLevel;
    }

    public void setUnconscious(boolean unconscious) {
        this.unconscious = unconscious;
    }

    public void setChestPain(boolean chestPain) {
        this.chestPain = chestPain;
    }

    public void setBreathingDifficulty(boolean breathingDifficulty) {
        this.breathingDifficulty = breathingDifficulty;
    }
}