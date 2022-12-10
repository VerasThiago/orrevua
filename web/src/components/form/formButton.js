import { connect } from 'react-redux';

// eslint-disable-next-line no-unused-vars
function FormButton({ dispatch, loading, children, ...props }) {
  if (loading)
    return (
      <button disabled {...props}>
        <div className="d-flex justify-content-center align-items-center gap-2">
          <div className="spinner-border spinner-border-sm" role="status"></div>
          <span>{children}</span>
        </div>
      </button>
    );

  return <button {...props}>{children}</button>;
}

function mapStateToProps(state) {
  return {
    loading: state.submitting
  };
}

export default connect(mapStateToProps)(FormButton);
