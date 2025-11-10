package com.example.backend;

import com.example.backend.dto.PostDTO;
import com.example.backend.entity.Post;
import com.example.backend.service.PostService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/community")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // 전체 게시글 조회 (DTO로 변환)
    @GetMapping
    public List<PostDTO> getAllPosts() {
        return postService.getAllPosts()
                .stream()
                .map(PostDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 게시글 작성 (로그인 필요)
    @PostMapping
    public ResponseEntity<PostDTO> createPost(
            @RequestBody Post post,
            @AuthenticationPrincipal UserDetails userDetails) {

        Post createdPost = postService.createPost(post, userDetails);
        return ResponseEntity.ok(PostDTO.fromEntity(createdPost));
    }

    // 게시글 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPost(@PathVariable Long id) {
        Post post = postService.getPost(id);
        return ResponseEntity.ok(PostDTO.fromEntity(post));
    }

    // 게시글 수정 (작성자 본인만 가능)
    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> updatePost(
            @PathVariable Long id,
            @RequestBody Post updatedPost,
            @AuthenticationPrincipal UserDetails userDetails) {

        Post post = postService.updatePost(id, updatedPost, userDetails);
        return ResponseEntity.ok(PostDTO.fromEntity(post));
    }

    // 게시글 삭제 (작성자 본인만 가능)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        postService.deletePost(id, userDetails);
        return ResponseEntity.noContent().build();
    }
}
