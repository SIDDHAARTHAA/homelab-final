export default function Popup({ show, onClose, children }) {
    if (!show) return null;

    return (
        <div
            onClick={onClose} // clicking the backdrop triggers close
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
            <div
                onClick={(e) => e.stopPropagation()} // prevent click inside popup from closing
                className="bg-white p-6 rounded-lg shadow-xl"
            >
                {children}
            </div>
        </div>
    );
}
