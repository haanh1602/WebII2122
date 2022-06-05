import AreaService from '../services/area.service';

export default function TinhOption(props) {
    console.log(AreaService.getQuan());
    return (
        <div>
            <select required>
                <option value=""
                        hidden
                >--Quận/Huyện--</option>
                {
                    AreaService.getQuan().map((area) => {
                        return (<option key={area.id} value={area.name}>{area.name}</option>)
                    })
                }
            </select>
        </div>
    );
}

export function QuanOption(props) {
    const onChange = (event) => {
        props.choose(event.target.value);
        console.log(event.target.value);
    }

    return (
        <div>
            <select required onChange = {onChange}>
                <option value=""
                        hidden
                >--Quận/Huyện--</option>
                {
                    AreaService.getQuan().map((area) => {
                        return (<option key={area.code} value={area.code}>{area.name}</option>)
                    })
                }
            </select>
        </div>
    );
}

export function PhuongOption(props) {
    const onChange = (event) => {
        props.choose(event.target.value);
        console.log(event.target.value);
    }
    return (
        <div>
            <select required onChange = {onChange}>
                <option value=""
                        hidden
                >--Phường/Xã--</option>
                {
                    AreaService.getPhuong(parseInt(props.areaId) * 100000).map((area) => {
                        return (<option key={area.code} value={area.code}>{area.name}</option>)
                    })
                }
            </select>
        </div>
    );
}