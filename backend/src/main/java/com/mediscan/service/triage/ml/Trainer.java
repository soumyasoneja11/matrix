package com.mediscan.service.triage.ml;

import java.util.List;

public class Trainer {

    public void train(TriageModel m, List<DataPoint> data) {

        for (int epoch = 0; epoch < 200; epoch++) {

            for (DataPoint d : data) {

                int pred = m.predict(d.x);

                if (pred != d.y) {

                    for (int j = 0; j < d.x.length; j++) {
                        m.getW()[d.y][j] += d.x[j];
                        m.getW()[pred][j] -= d.x[j];
                    }
                }
            }
        }
    }
}