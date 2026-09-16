package com.example.studentmanagement.repository;

import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.model.StudentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    Optional<Student> findByStudentId(String studentId);
    
    Optional<Student> findByEmail(String email);
    
    Page<Student> findByCourse(String course, Pageable pageable);
    
    Page<Student> findByStatus(StudentStatus status, Pageable pageable);
    
    Page<Student> findBySemester(Integer semester, Pageable pageable);
    
    Page<Student> findByCourseAndSemester(String course, Integer semester, Pageable pageable);
    
    Page<Student> findByStatusAndCourse(StudentStatus status, String course, Pageable pageable);
    
    @Query("SELECT s FROM Student s WHERE LOWER(s.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(s.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(s.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(s.studentId) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Student> searchStudents(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT s FROM Student s WHERE s.status = :status " +
           "AND LOWER(s.course) LIKE LOWER(CONCAT('%', :course, '%'))")
    List<Student> findActiveStudentsByCourse(@Param("status") StudentStatus status, @Param("course") String course);
    
    @Query("SELECT COUNT(s) FROM Student s WHERE s.status = :status")
    Long countByStatus(@Param("status") StudentStatus status);
    
    @Query("SELECT DISTINCT s.course FROM Student s ORDER BY s.course")
    List<String> findAllCourses();
    
    @Query("SELECT s FROM Student s WHERE s.course = :course ORDER BY s.semester, s.lastName")
    List<Student> findStudentsByCourseOrdered(@Param("course") String course);
}
