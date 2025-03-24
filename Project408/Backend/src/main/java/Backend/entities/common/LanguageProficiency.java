package Backend.entities.common;

import Backend.core.enums.LanguageLevel;
import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "language_proficiencies")
public class LanguageProficiency extends BaseEntity {

    @Column(nullable = false)
    private String language;

    @Enumerated(EnumType.STRING)
    @Column(name = "reading_level")
    private LanguageLevel readingLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "writing_level")
    private LanguageLevel writingLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "speaking_level")
    private LanguageLevel speakingLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "listening_level")
    private LanguageLevel listeningLevel;
}
