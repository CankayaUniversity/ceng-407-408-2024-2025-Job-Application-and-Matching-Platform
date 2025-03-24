package Backend.entities.user.candidate;

import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "social_links")
public class SocialLinks extends BaseEntity {

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "website_url")
    private String websiteUrl;

    @Column(name = "blog_url")
    private String blogUrl;

    @Column(name = "other_links_url")
    private String otherLinksUrl;

    @Column(name = "other_links_description", length = 500)
    private String otherLinksDescription;

}
