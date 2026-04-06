package com.mediscan.service.triage.ml;

public class TriageModel {

    double[][] w;

    public TriageModel(int features) {
        w = new double[3][features];
    }

    public int predict(double[] x) {

        double max = -999;
        int idx = 0;

        for (int i = 0; i < 3; i++) {
            double sum = 0;

            for (int j = 0; j < x.length; j++) {
                sum += w[i][j] * x[j];
            }

            if (sum > max) {
                max = sum;
                idx = i;
            }
        }

        return idx;
    }

    public double[][] getW() {
        return w;
    }
}