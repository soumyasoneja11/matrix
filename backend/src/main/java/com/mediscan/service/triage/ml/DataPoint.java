package com.mediscan.service.triage.ml;

public class DataPoint {
    public double[] x;
    public int y;

    public DataPoint(double[] x, int y) {
        this.x = x;
        this.y = y;
    }
}