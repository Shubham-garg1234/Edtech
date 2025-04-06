package com.edtech.edtch.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import com.edtech.edtch.models.Courses;
import com.edtech.edtch.models.Lectures;
import com.edtech.edtch.repositories.CoursesRepo;
import com.edtech.edtch.repositories.LectureRepo;

import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;

@Service
public class VideoService {

    @Autowired
    private CoursesRepo coursesRepo;

    @Autowired
    private LectureRepo lectureRepo;

    private final S3Client s3Client;

    @Value("${aws.s3.bucketName}")
    private String bucketName;

    @Autowired
    public VideoService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public ResponseEntity<StreamingResponseBody> getVideoStream(String videoKey, String rangeHeader)
            throws IOException {
        HeadObjectRequest headRequest = HeadObjectRequest.builder()
                .bucket(bucketName)
                .key(videoKey)
                .build();
        HeadObjectResponse headResponse = s3Client.headObject(headRequest);
        long fileSize = headResponse.contentLength();

        long start = 0;
        long end = fileSize - 1;
        if (rangeHeader != null && rangeHeader.startsWith("bytes=")) {
            String[] ranges = rangeHeader.substring("bytes=".length()).split("-");
            try {
                start = Long.parseLong(ranges[0]);
                if (ranges.length > 1 && !ranges[1].isEmpty()) {
                    end = Long.parseLong(ranges[1]);
                }
            } catch (NumberFormatException e) {
                start = 0;
                end = fileSize - 1;
            }
        }
        long contentLength = end - start + 1;

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(videoKey)
                .range("bytes=" + start + "-" + end)
                .build();

        ResponseInputStream<GetObjectResponse> s3ObjectStream = s3Client.getObject(getObjectRequest);

        StreamingResponseBody responseBody = outputStream -> {
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = s3ObjectStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            s3ObjectStream.close();
        };

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "video/mp4");
        headers.add("Accept-Ranges", "bytes");
        headers.add("Content-Length", String.valueOf(contentLength));
        headers.add("Content-Range", "bytes " + start + "-" + end + "/" + fileSize);
        headers.add("Content-Disposition", "inline");

        HttpStatus status = (rangeHeader != null) ? HttpStatus.PARTIAL_CONTENT : HttpStatus.OK;
        return new ResponseEntity<>(responseBody, headers, status);
    }

    public String uploadFile(MultipartFile file, String key, String Title, String description, int courseId, String Duration) throws IOException {
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        Courses course = coursesRepo.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));

        Lectures lecture = new Lectures();
        lecture.setLectureId(key.hashCode());
        lecture.setKey(key);
        lecture.setTitle(Title);
        lecture.setDescription(description);
        lecture.setDuration(Duration);
        lecture.setCourse(course);

        lectureRepo.save(lecture);
        
        return key;
    }
}
