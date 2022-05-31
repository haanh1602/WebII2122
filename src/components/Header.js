import React, {useState, useEffect} from 'react';

export default function Header(props) {
    return (
        <div>
            <div>
                <div>
                    <img src={config.logoUrl} alt="logo" />
                    <div>
                        <p>Bộ y tế</p>
                        <p>Cục an toàn vệ sinh thực phẩm</p>
                    </div>
                </div>
                <div>
                    <div>
                        <p>Phòng an toàn vệ sinh thực phẩm</p>
                        <p>Phường Mai Dịch</p>
                    </div>
                    <div>
                        <div>
                            <img src=""/>
                            <p>Chuyên viên 1</p>
                        </div>
                        <div>
                            <img src=""/>
                            <p>Đăng xuất</p>
                        </div>
                        <div>
                            <img src=""/>
                            <p>Thông báo</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}