package com.example.backend;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/pdi")
public class PdiImageController {
    private final String FASTAPI_BASE_URL = "http://13.124.222.250:8000";
    private final RestTemplate restTemplate = new RestTemplate();

    // 지역 목록 제공
    @GetMapping("/regions")
    public List<String> getRegions() {
        String pythonApiUrl = FASTAPI_BASE_URL + "/pdi/regions";

        // FastAPI에서 JSON 배열 형태로 반환됨
        String[] regions = restTemplate.getForObject(pythonApiUrl, String[].class);

        return Arrays.asList(regions);
    }

    // 지역별 이미지
    @GetMapping("/region/{regionName}")
    public ResponseEntity<ByteArrayResource> getRegionPdi(@PathVariable String regionName) {
        String pythonApiUrl = FASTAPI_BASE_URL + "/pdi/region/" + regionName;

        byte[] imageBytes = restTemplate.getForObject(pythonApiUrl, byte[].class);
        ByteArrayResource resource = new ByteArrayResource(imageBytes);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"pdi_" + regionName + ".png\"")
                .body(resource);
    }

    // 도시규모 목록 제공
    @GetMapping("/city_sizes")
    public List<String> getCitySizes() {
        String pythonApiUrl = FASTAPI_BASE_URL + "/pdi/city_sizes";
        String[] citySizes = restTemplate.getForObject(pythonApiUrl, String[].class);
        return Arrays.asList(citySizes);
    }

    // 도시규모별 이미지
    @GetMapping("/city_size/{citySizeName}")
    public ResponseEntity<ByteArrayResource> getCitySizePdi(@PathVariable String citySizeName) {
        String pythonApiUrl = FASTAPI_BASE_URL + "/pdi/city_size/" + citySizeName;
        byte[] imageBytes = restTemplate.getForObject(pythonApiUrl, byte[].class);
        ByteArrayResource resource = new ByteArrayResource(imageBytes);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"pdi_" + citySizeName + ".png\"")
                .body(resource);
    }

    // 성별연령 목록 제공
    @GetMapping("/gender_ages")
    public List<String> getGenderAges() {
        String pythonApiUrl = FASTAPI_BASE_URL + "/pdi/gender_ages";
        String[] genderAges = restTemplate.getForObject(pythonApiUrl, String[].class);
        return Arrays.asList(genderAges);
    }

    // 성별연령별 이미지
    @GetMapping("/gender_age/{genderAgeName}")
    public ResponseEntity<ByteArrayResource> getGenderAgePdi(@PathVariable String genderAgeName) {
        String pythonApiUrl = FASTAPI_BASE_URL + "/pdi/gender_age/" + genderAgeName;
        byte[] imageBytes = restTemplate.getForObject(pythonApiUrl, byte[].class);
        ByteArrayResource resource = new ByteArrayResource(imageBytes);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"pdi_" + genderAgeName + ".png\"")
                .body(resource);
    }
}
