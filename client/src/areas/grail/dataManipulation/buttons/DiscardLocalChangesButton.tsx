import * as React from "react";
import { HolyGrailDataManager } from "../../HolyGrailDataManager";
import ButtonWithProgress from "../../../../common/components/ButtonWithProgress";
import { Subscription } from "rxjs";
import ChoiceDialog, { createDefaultConfirmButtons } from "../../../../common/components/ChoiceDialog";

export interface IDiscardChangesButtonState {
  isEnabled?: boolean;
  showConfirm?: boolean;
}

class DiscardChangesButton extends React.Component<{}, IDiscardChangesButtonState> {
  private localChangesSubscription: Subscription;

  public constructor(props: {}) {
    super(props);
    this.state = {};
  }

  public componentWillMount() {
    this.localChangesSubscription = HolyGrailDataManager.current.hasLocalChanges$.subscribe(hasChanges =>
      this.setState({ isEnabled: hasChanges })
    );
  }

  public componentWillUnmount() {
    if (this.localChangesSubscription) {
      this.localChangesSubscription.unsubscribe();
    }
  }

  public render() {
    if (HolyGrailDataManager.current.isReadOnly) {
      return null;
    }

    return (
      <div>
        {this.state.showConfirm && (
          <ChoiceDialog
            content="Are you sure you want to discard all your local changes?"
            buttons={createDefaultConfirmButtons("Yes", "No")}
            onClose={this.onConfirmDialogClose}
          />
        )}
        <ButtonWithProgress
          onButtonClick={() => this.setState({ showConfirm: true })}
          isDisabled={!this.state.isEnabled}
          text="Discard local changes"
          firstIcon="cancel"
        />
      </div>
    );
  }

  private onConfirmDialogClose = (ok?: boolean) => {
    if (ok) {
      HolyGrailDataManager.current.discardCache();
      location.reload();
    }
    this.setState({ showConfirm: false });
  };
}

export default DiscardChangesButton;
