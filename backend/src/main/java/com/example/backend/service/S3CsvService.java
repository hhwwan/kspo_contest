package com.example.backend.service;

import com.example.backend.model.Exercise;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class S3CsvService {

    private final S3Client s3Client;

    public S3CsvService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public List<Exercise> loadExercisesFromS3(String bucketName, String fileKey) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                s3Client.getObject(GetObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fileKey)
                        .build()),
                StandardCharsets.UTF_8))) {

            // 첫 줄은 헤더
            return reader.lines()
                    .skip(1)
                    .map(line -> line.split(","))
                    .filter(cols -> cols.length >= 7)
                    .map(cols -> new Exercise(
                            Integer.parseInt(cols[0].trim()), // 번호
                            cols[1].trim(),  // 대분류
                            cols[2].trim(),  // 중분류
                            cols[3].trim(),  // 소분류
                            cols[4].trim(),  // 제목
                            cols[5].trim(),  // 동영상주소
                            cols[6].trim()   // 운동장소 구분
                    ))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}
