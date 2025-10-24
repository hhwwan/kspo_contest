package com.example.backend.controller;

import com.example.backend.model.Exercise;
import com.example.backend.service.S3CsvService;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exercise")
public class ExerciseController {

    private final S3CsvService s3CsvService;

    // S3 버킷 이름과 파일 키는 환경변수나 properties로 관리 가능 근데 겹칠거 같아서 여기에
    private final String bucketName = "kspo";
    private final String fileKey = "processed_data/kspo_physical_100/kspo_video_link.csv";

    public ExerciseController(S3CsvService s3CsvService) {
        this.s3CsvService = s3CsvService;
    }

    @GetMapping("/recommend")
    public List<Map<String, String>> recommendExercise(@RequestParam String locationType) {
        List<Exercise> exercises = s3CsvService.loadExercisesFromS3(bucketName, fileKey);

        // 운동장소 구분 필터링
        List<Exercise> filtered = exercises.stream()
                .filter(e -> e.getLocationType().equalsIgnoreCase(locationType))
                .collect(Collectors.toList());

        // 랜덤 추천 3개
        Collections.shuffle(filtered);
        return filtered.stream()
                .limit(3)
                .map(e -> Map.of(
                        "number", String.valueOf(e.getNumber()),
                        "category", e.getCategory(),
                        "subCategory", e.getSubCategory(),
                        "detailCategory", e.getDetailCategory(),
                        "title", e.getTitle(),
                        "url", e.getVideoUrl(),
                        "locationType", e.getLocationType()
                ))
                .collect(Collectors.toList());
    }
}
