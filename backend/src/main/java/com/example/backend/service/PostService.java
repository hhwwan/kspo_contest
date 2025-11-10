package com.example.backend.service;

import com.example.backend.entity.Post;
import com.example.backend.model.User;
import com.example.backend.repository.PostRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post createPost(Post post, UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        post.setAuthor(user);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());

        return postRepository.save(post);
    }

    public Post getPost(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
    }

    public Post updatePost(Long id, Post updatedPost, UserDetails userDetails) {
        Post post = getPost(id);

        if (!post.getAuthor().getUsername().equals(userDetails.getUsername())) {
            throw new RuntimeException("작성자만 수정할 수 있습니다.");
        }

        post.setTitle(updatedPost.getTitle());
        post.setContent(updatedPost.getContent());
        post.setUpdatedAt(LocalDateTime.now());

        return postRepository.save(post);
    }

    public void deletePost(Long id, UserDetails userDetails) {
        Post post = getPost(id);

        if (!post.getAuthor().getUsername().equals(userDetails.getUsername())) {
            throw new RuntimeException("작성자만 삭제할 수 있습니다.");
        }

        postRepository.delete(post);
    }
}
