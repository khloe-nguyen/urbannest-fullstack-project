import "./icon.css";

export default function AlertIcon() {
  return (
    <div className="f-modal-alert">
      <div className="f-modal-icon f-modal-warning scaleWarning">
        <span className="f-modal-body pulseWarningIns"></span>
        <span class="f-modal-dot pulseWarningIns"></span>
      </div>
    </div>
  );
}
