import React from 'react';
import { noop } from './util.js'

class CardControlBar extends React.Component {
  render() {
    return (
      <div className="cardControlBar row" onClick={this.props.onClick}>
        <button className="discard"><span role="img" aria-label="red X">❌</span></button>
      </div>
    );
  }
}

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.titleInput = React.createRef();
    this.onCardSelect = this.props.onCardSelect;
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // focus title field of newly created card
    // 
    // this should be the only situation where this conditional holds. fingers crossed emoji.
    if (this.isSelected() && this.props.cardData.title === "" && this.props.cardData.description === "" && !this.props.selectedCardInputValues.keys) {
      this.titleInput.current.focus();
    }
  }

  titlePlaceholder() {
    switch(this.props.cardData.cardType) {
    case "sym":
      return "New Symptom";
    case "hyp":
      return "New Hypothesis";
    case "act":
      return "New Action";
    default:
      console.log("unknown card type '" + this.props.cardData.cardType + "'");
    }
  }

  descriptionPlaceholder() {
    switch(this.props.cardData.cardType) {
    case "sym":
      return "A piece of information about the problem that we've obtained by directly observing the system.";
    case "hyp":
      return "A plausible, testable explanation for a symptom or group of symptoms.";
    case "act":
      return "An action we will take to either falsify one or more hypotheses or deepen our understanding of the problem.";
    default:
      console.log("unknown card type '" + this.props.cardData.cardType + "'");
    }
  }

  isSelected() {
    return (this.props.selectedCard && this.props.cardData.cardID === this.props.selectedCard.cardID);
  }

  isSurfaced() {
    if (!this.props.selectedCard) {
      return false;
    }
    if (this.props.cardData.cardID === this.props.selectedCard.cardID) {
      return false;
    }
    for (let i=0; i<this.props.surfacedCards.length; i++) {
      if (this.props.cardData.cardID === this.props.surfacedCards[i]) {
        return true;
      }
    }
    return false;
  }

  isDiscarded() {
    return this.props.cardData.discarded;
  }

  handleClick(e) {
    if (this.isSelected()) {
      return;
    }
    // bubble the event up to whatever's managing state
    this.onCardSelect({target: this});
  }

  handleSubmit(e) {
    e.preventDefault()
  }

  divClasses() {
    let classes = [
      "row",
      "card",
      "card-" + this.props.cardData.cardType,
      "card-" + (this.isSelected() ? "selected" : "deselected")
    ];
    if (this.isSurfaced()) {
      classes.push("card-surfaced");
    }
    if (this.isDiscarded()) {
      classes.push("card-discarded")
    };
    return classes.join(" ");
  }

  fieldValue(fieldName) {
    if (!this.props.selectedCardInputValues) {
      return this.props.cardData[fieldName];
    }
    if (!this.props.selectedCardInputValues.hasOwnProperty(fieldName)) {
      return this.props.cardData[fieldName];
    }
    return this.props.selectedCardInputValues[fieldName];
  }

  renderDeselected() {
    return (
      <div className={this.divClasses()} onClick={this.handleClick}>
        <div className="cardTitle">{this.props.cardData.title}</div>
        <div className="cardDescription">{this.props.cardData.description}</div>
      </div>
    );
  }

  renderSelected() {
    return (
      <div className={this.divClasses()} onClick={this.handleClick}>
        <CardControlBar
          onClick={() => {this.props.onCardDiscard(this.props.cardData.cardID);}}
        />
        <form onSubmit={this.handleSubmit} onChange={this.props.onCardChange}>
          <div className="form-group">
            <input
              ref={this.titleInput}
              className="cardTitle"
              type="text"
              name="title"
              value={this.fieldValue("title")}
              placeholder={this.titlePlaceholder()}
              // Avoids the annoying and baseless warnings about "you provided a `value` prop to a form
              // field without an `onChange` handler.
              onChange={noop}
            />
          </div>
          <div className="form-group">
            <textarea
              className="cardDescription"
              name="description"
              rows={4}
              value={this.fieldValue("description")}
              placeholder={this.descriptionPlaceholder()}
              // Avoids the annoying and baseless warnings about "you provided a `value` prop to a form
              // field without an `onChange` handler.
              onChange={noop}
            />
          </div>
        </form>
      </div>
    );
  }

  render() {
    return this.isSelected() ? this.renderSelected() : this.renderDeselected();
  }
}

export default Card;
