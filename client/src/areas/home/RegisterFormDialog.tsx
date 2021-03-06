import * as React from "react";
import { createStyles, WithStyles, Theme, withStyles } from "@material-ui/core";
import { ILoginInfo } from "./LoginForm";
import { Api } from "../../common/utils/Api";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Icon from "@material-ui/core/Icon/Icon";
import TextField from "@material-ui/core/TextField/TextField";
import { ButtonWithProgress } from "../../common/components/ButtonWithProgress";

export interface IRegisterFormDialogProps {
  onDialogClosed: (loginInfo?: ILoginInfo) => any;
}

type Props = IRegisterFormDialogProps & WithStyles<typeof styles>;

interface IRegisterFormDialogState {
  address?: string;
  password?: string;
  error?: string;
  isLoading?: boolean;
}

class RegisterFormDialogInternal extends React.Component<Props, IRegisterFormDialogState> {
  public constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render() {
    return (
      <Dialog open={true} onClose={() => this.props.onDialogClosed()}>
        <DialogTitle id="form-dialog-title">Create your own Holy Grail</DialogTitle>
        <DialogContent>
          <div>
            <Icon className={this.props.classes.closeIcon} onClick={() => this.props.onDialogClosed()}>
              close
            </Icon>
            {this.state.error && (
              <DialogContentText className={this.props.classes.errorMessage}>{this.state.error}</DialogContentText>
            )}
            <div>
              <TextField
                className={this.props.classes.textField}
                label="Holy Grail address"
                onChange={e => this.setState({ address: e.target.value })}
              />
            </div>
            <div>
              <TextField
                className={this.props.classes.textField}
                label="Password"
                onChange={e => this.setState({ password: e.target.value })}
              />
              <div className={this.props.classes.securityInfo}>
                <div className={this.props.classes.infoIconContainer}>
                  <DialogContentText>
                    <Icon>info</Icon>
                  </DialogContentText>
                </div>
                <div>
                  <DialogContentText>
                    Please do not choose a sensitive password, since we're not really paying attention to data security
                    ;)
                  </DialogContentText>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <ButtonWithProgress
            isLoading={this.state.isLoading}
            onClick={() => this.register()}
            text="Register"
            isDisabled={!this.state.address || !this.state.password}
          />
        </DialogActions>
      </Dialog>
    );
  }

  private register = () => {
    this.setState({ isLoading: true });
    Api.createGrail(this.state.address, this.state.password).subscribe(
      () => {
        this.setState({ isLoading: false });
        this.props.onDialogClosed({
          address: this.state.address,
          password: this.state.password,
          keepLoggedIn: false
        });
      },
      err =>
        this.setState({
          isLoading: false,
          error:
            err.data && err.data.type === "duplicateKey"
              ? "There is already a Holy Grail for this address! Please choose another one!"
              : "There was an unknown error when trying to create your Holy Grail!"
        })
    );
  };
}

const styles = (theme: Theme) =>
  createStyles({
    closeIcon: {
      position: "absolute",
      top: theme.spacing.unit,
      right: theme.spacing.unit,
      cursor: "pointer"
    },
    textField: {
      width: 300,
      marginTop: theme.spacing.unit * 2
    },
    securityInfo: {
      fontStyle: "italic",
      paddingTop: theme.spacing.unit * 4,
      display: "flex"
    },
    infoIconContainer: {
      alignSelf: "center",
      paddingRight: theme.spacing.unit
    },
    errorMessage: {
      color: theme.palette.error.main
    }
  });

export const RegisterFormDialog = withStyles(styles)(RegisterFormDialogInternal);
