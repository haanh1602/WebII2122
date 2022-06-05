export default function BusinessOption(props) {

    const business = [{name: "Sản xuất thực phẩm", id: 1},{name: "Dịch vụ ăn uống" , id: 2}];

    const onChange = (event) => {
        props.choose(event.target.value);
        console.log(event.target.value);
    }
    
    return (
        <div>
            <select required onChange={onChange}>
                <option value=""
                        hidden
                >--Loại hình kinh doanh--</option>
                {
                    business.map((businessType) => {
                        return (<option key={businessType.id} value={businessType.id}>{businessType.name}</option>)
                    })
                }
            </select>
        </div>
    );
}