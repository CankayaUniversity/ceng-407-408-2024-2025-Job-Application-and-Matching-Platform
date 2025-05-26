package Backend.entities.common;

import Backend.core.enums.LanguageLevel;
import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity

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



    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public LanguageLevel getReadingLevel() {
        return readingLevel;
    }

    public void setReadingLevel(LanguageLevel readingLevel) {
        this.readingLevel = readingLevel;
    }

    public LanguageLevel getWritingLevel() {
        return writingLevel;
    }

    public void setWritingLevel(LanguageLevel writingLevel) {
        this.writingLevel = writingLevel;
    }

    public LanguageLevel getSpeakingLevel() {
        return speakingLevel;
    }

    public void setSpeakingLevel(LanguageLevel speakingLevel) {
        this.speakingLevel = speakingLevel;
    }

    public LanguageLevel getListeningLevel() {
        return listeningLevel;
    }

    public void setListeningLevel(LanguageLevel listeningLevel) {
        this.listeningLevel = listeningLevel;
    }
}
