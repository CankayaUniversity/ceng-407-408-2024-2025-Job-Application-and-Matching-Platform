package Backend.entities.user.candidate;

import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
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

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public String getBlogUrl() {
        return blogUrl;
    }

    public void setBlogUrl(String blogUrl) {
        this.blogUrl = blogUrl;
    }

    public String getOtherLinksUrl() {
        return otherLinksUrl;
    }

    public void setOtherLinksUrl(String otherLinksUrl) {
        this.otherLinksUrl = otherLinksUrl;
    }

    public String getOtherLinksDescription() {
        return otherLinksDescription;
    }

    public void setOtherLinksDescription(String otherLinksDescription) {
        this.otherLinksDescription = otherLinksDescription;
    }
}
