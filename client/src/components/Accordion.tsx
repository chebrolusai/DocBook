import React from "react";

interface Faq {
  question: string;
  answer: string;
}

interface AccordionProps {
  faqs: Faq[];
}

const Accordion: React.FC<AccordionProps> = ({ faqs }) => {
  return (
    <div className="align">
      <p id="faqs" className="h4">
        Frequently Asked Questions
      </p>
      <div className="accordion" id="accordionPanelsStayOpenExample">
        {faqs.map((faq, index) => (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#panelsStayOpen-collapse${index + 1}`}
                aria-expanded="true"
                aria-controls={`panelsStayOpen-collapse${index + 1}`}
              >
                {faq.question}
              </button>
            </h2>
            <div
              id={`panelsStayOpen-collapse${index + 1}`}
              className="accordion-collapse collapse"
            >
              <div className="accordion-body">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accordion;
