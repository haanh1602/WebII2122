import '../css/logo.css';

export default function Logo(props) {
    return (
        <div className={props.style}>
            <div className="logo-field">
                <img src="https://vfa.gov.vn/public/images/logo_share.png" alt="Bộ y tế" />
                <div>Bộ y tế</div>
                <div>Cục kiểm tra an toàn thực phẩm</div>
            </div>
        </div>
    );
}