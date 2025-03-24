package Backend.entities.user.candidate;

import Backend.core.enums.DocumentCategory;
import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "uploaded_documents")
public class UploadedDocument extends BaseEntity {

    @Column(name = "document_name", nullable = false)
    private String documentName;

    @Column(name = "document_type")
    private String documentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_category", nullable = false)
    private DocumentCategory documentCategory;

    @Column(name = "document_url", nullable = false)
    private String documentUrl;

    @Column(name = "is_private")
    private boolean isPrivate;
}
