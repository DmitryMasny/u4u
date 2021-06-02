import { connect } from 'react-redux';
import WINDOW_TEXT from 'texts/userAgreement';
import { modalUserAgreementAction } from 'actions/modals';
import SimpleText from 'modals//simpleText';

class UserAgreement extends SimpleText {
    title = WINDOW_TEXT.title;
    text = WINDOW_TEXT.text;
}

export default connect(
    state => ({}),
    dispatch => ({
        closeAction: ( show ) => dispatch( modalUserAgreementAction ( show ) )
    })
)(UserAgreement);
