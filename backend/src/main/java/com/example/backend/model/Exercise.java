package com.example.backend.model;

public class Exercise {
    private int number;             // 번호
    private String category;        // 대분류
    private String subCategory;     // 중분류
    private String detailCategory;  // 소분류
    private String title;           // 제목
    private String videoUrl;        // 동영상주소
    private String locationType;    // 운동장소 구분 (실내운동 / 실외운동)

    public Exercise(int number, String category, String subCategory, String detailCategory,
                    String title, String videoUrl, String locationType) {
        this.number = number;
        this.category = category;
        this.subCategory = subCategory;
        this.detailCategory = detailCategory;
        this.title = title;
        this.videoUrl = videoUrl;
        this.locationType = locationType;
    }

    // Getter
    public int getNumber() { return number; }
    public String getCategory() { return category; }
    public String getSubCategory() { return subCategory; }
    public String getDetailCategory() { return detailCategory; }
    public String getTitle() { return title; }
    public String getVideoUrl() { return videoUrl; }
    public String getLocationType() { return locationType; }
}
