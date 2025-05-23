package Backend.entities.common;

import Backend.entities.BaseEntity;
import Backend.entities.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "reported_blogs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportedBlog extends BaseEntity {
    
    @Column(name = "blog_id", nullable = false)
    private Integer blogId;
    
    @Column(name = "blog_title", nullable = false)
    private String blogTitle;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id")
    private User reporter;
    
    @Column(name = "reason", nullable = false, length = 500)
    private String reason;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReportStatus status = ReportStatus.PENDING;
} 