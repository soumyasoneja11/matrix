package com.mediscan.model.enums;

public enum TriagePriority {
    RED("EMERGENCY", 1, "Immediate professional attention required"),
    ORANGE("VERY URGENT", 2, "Professional attention with 10 minutes"),
    YELLOW("URGENT", 3, "Professional attention within 60 minutes"),
    GREEN("STANDARD", 4, "Professional attention within 120 minutes"),
    BLUE("NON-URGENT", 5, "Professional attention within 240 minutes");

    private final String label;
    private final int level;
    private final String description;

    TriagePriority(String label, int level, String description) {
        this.label = label;
        this.level = level;
        this.description = description;
    }

    public String getLabel() { return label; }
    public int getLevel() { return level; }
    public String getDescription() { return description; }
}
