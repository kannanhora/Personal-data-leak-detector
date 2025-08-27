import spacy

nlp = spacy.load("en_core_web_sm")

def analyze_text(text: str):
    """
    Analyze text with NLP to extract entities.
    Returns a list of dicts with {entity, label}.
    """
    doc = nlp(text)
    entities = []
    for ent in doc.ents:
        entities.append({"entity": ent.text, "label": ent.label_})
    return entities
