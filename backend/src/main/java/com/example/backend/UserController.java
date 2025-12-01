package com.example.backend;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.Serializable;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final String bucketName = "kspo";
    private final String objectKey = "processed_data/leisure_activity/leisure_activity_gender_age.csv";

    @Value("${aws.accessKeyId}")
    private String accessKey;

    @Value("${aws.secretAccessKey}")
    private String secretKey;


    @GetMapping("/search")
    public ResponseEntity<?> getUserData(
            @RequestParam String gender,
            @RequestParam String age) {

        try {
            S3Client s3 = S3Client.builder()
                    .region(Region.AP_NORTHEAST_2)
                    .credentialsProvider(StaticCredentialsProvider.create(
                            AwsBasicCredentials.create(accessKey, secretKey)))
                    .build();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(
                            s3.getObject(GetObjectRequest.builder()
                                    .bucket(bucketName)
                                    .key(objectKey)
                                    .build())
                    )
            );

            String headerLine = reader.readLine();
            if (headerLine == null) return ResponseEntity.badRequest().body("EMPTY CSV");

            String[] headers = headerLine.split(",");

            List<Map<String, String>> all = new ArrayList<>();
            String line;

            while ((line = reader.readLine()) != null) {
                String[] v = line.split(",");
                if (v.length != headers.length) continue;

                Map<String, String> row = new LinkedHashMap<>();
                for (int i = 0; i < headers.length; i++)
                    row.put(headers[i].trim(), v[i].trim());

                all.add(row);
            }

            List<Map<String, String>> filtered = all.stream()
                    .filter(r -> r.get("성별").equals(gender))
                    .filter(r -> r.get("연령").equals(age))
                    .collect(Collectors.toList());

            if (filtered.isEmpty()) return ResponseEntity.ok(List.of());


            Map<String, Double> scores = new HashMap<>();
            for (String key : filtered.get(0).keySet()) {
                if (key.equals("성별") || key.equals("연령")) continue;
                scores.put(key, Double.parseDouble(filtered.get(0).get(key)));
            }

            List<Map<String, ? extends Serializable>> top10 = scores.entrySet().stream()
                    .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                    .limit(10)
                    .map(e -> Map.of(
                            "activity", e.getKey(),
                            "score", e.getValue()
                    ))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(top10);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
