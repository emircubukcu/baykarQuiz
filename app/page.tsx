"use client"

import { ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Form from "next/form"
import axios from "axios";
import { useModal } from "@/hooks/use-modal.store";

interface SeatInfo {
    isim: string;
    soyisim: string;
    telefon: string;
    mail: string;
    cinsiyet: string;// 0 Boş 1-Erkek 2-Kadın
    dogumTarihi: Date;
    koltukDurum: number;// 0-Boş 1-Dolu 2-Seçili
}

export default function Home() {
    const { onOpen } = useModal()

    const [currentTimeoutID, setTimeID] = useState<number>()

    const [showPassengerDetail1, setDetail1] = useState(false)
    const [showPassengerDetail2, setDetail2] = useState(false)
    const [showPassengerDetail3, setDetail3] = useState(false)

    const [passenger1, setPassenger1] = useState<SeatInfo>({
        isim: "",
        soyisim: "",
        telefon: "",
        mail: "",
        cinsiyet: "0",
        dogumTarihi: new Date(),
        koltukDurum: 2
    })
    const [passenger2, setPassenger2] = useState<SeatInfo>({
        isim: "",
        soyisim: "",
        telefon: "",
        mail: "",
        cinsiyet: "0",
        dogumTarihi: new Date(),
        koltukDurum: 2
    })
    const [passenger3, setPassenger3] = useState<SeatInfo>({
        isim: "",
        soyisim: "",
        telefon: "",
        mail: "",
        cinsiyet: "0",
        dogumTarihi: new Date(),
        koltukDurum: 2
    })

    var [planePlan, setPlanePlan] = useState<SeatInfo[]>(new Array<SeatInfo>(60).fill({ isim: "", soyisim: "", telefon: "", mail: "", cinsiyet: "0", dogumTarihi: new Date(), koltukDurum: 0 }))

    const [selectedSeat, setSelectedSeat] = useState(useMemo(() => new Array(), []));

    var currentPassengerList: any[] = []

    useEffect(() => {
        axios.get("https://jsonplaceholder.typicode.com/users").then(res => {
            currentPassengerList = res.data
            var tempPlan = new Array<SeatInfo>(60).fill({ isim: "", soyisim: "", telefon: "", mail: "", cinsiyet: "0", dogumTarihi: new Date(), koltukDurum: 0 })
            currentPassengerList.forEach((el, index) => {
                tempPlan[index] = { isim: el.name.split(" ")[0], soyisim: el.name.split(" ")[1], telefon: el.phone, mail: el.email, dogumTarihi: new Date(), cinsiyet: "1", koltukDurum: 1 }
            })
            //@ts-ignore
            const localStoragePlan=JSON.parse(localStorage.getItem("plan"));
            if(localStoragePlan!=null){
                setPlanePlan(localStoragePlan)
                //@ts-ignore
                const localSelectedSeats:[]=JSON.parse(localStorage.getItem("selectedSeats"));
                setSelectedSeat(localSelectedSeats);
                showDetail(localSelectedSeats.length)
                //@ts-ignore
                const ps1:SeatInfo=JSON.parse(localStorage.getItem("ps1"))
                if(ps1!=null){
                    setPassenger1(ps1)
                }
                //@ts-ignore
                const ps2:SeatInfo=JSON.parse(localStorage.getItem("ps2"))
                if(ps2!=null){
                    setPassenger2(ps2)
                }
                //@ts-ignore
                const ps3:SeatInfo=JSON.parse(localStorage.getItem("ps3"))
                if(ps3!=null){
                    setPassenger3(ps3)
                }
            }
            else{
                setPlanePlan(tempPlan)
            }
        })
    }, [])

    const showDetail = (currentSelected: Number) => {
        switch (currentSelected) {
            case 1:
                setDetail1(true)
                break;
            case 2:
                setDetail1(true)
                setDetail2(true)
                break;
            case 3:
                setDetail1(true)
                setDetail2(true)
                setDetail3(true)
                break;

            default:
                break;
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> |React.ChangeEvent<HTMLSelectElement> , index: number) => {
        const { name, value } = e.target;

        if (selectedSeat.length <= 1 && currentTimeoutID != 0) {
            clearTimeout(currentTimeoutID)
        }
        switch (index) {
            case 1:
                setPassenger1(prevData => ({ ...prevData, [name]: value }))
                localStorage.setItem("ps1",JSON.stringify({ ...passenger1, [name]: value }))
                break;
            case 2:
                setPassenger2(prevData => ({ ...prevData, [name]: value }))
                localStorage.setItem("ps2",JSON.stringify({ ...passenger2, [name]: value }))
                break;
            case 3:
                setPassenger3(prevData => ({ ...prevData, [name]: value }))
                localStorage.setItem("ps3",JSON.stringify({ ...passenger3, [name]: value }))
                break;
        }
    }

    const fillSeat = (seatIndex: number) => {
        if (selectedSeat.length >= 3) {
            onOpen("cannotSelectMore")
        }
        else {
            if (!selectedSeat.includes(seatIndex) && seatIndex > 9) {
                selectedSeat.push(seatIndex)
                selectedSeat.sort()
                if (selectedSeat.length == 1) {
                    var test = setTimeout(() => { onOpen("inactive") }, 30000)
                    //@ts-ignore
                    setTimeID(test)
                }
                else {
                    clearTimeout(currentTimeoutID)
                }
                if (selectedSeat.length <= 3) {
                    const newPlan: SeatInfo[] = planePlan.map((seat, index) => {
                        if (index == seatIndex && seat.koltukDurum <= 0) {
                            return ({ isim: seat.isim, soyisim: seat.soyisim, telefon: seat.telefon, mail: seat.mail, cinsiyet: seat.cinsiyet, dogumTarihi: seat.dogumTarihi, koltukDurum: 2 })
                        }
                        return ({ isim: seat.isim, soyisim: seat.soyisim, telefon: seat.telefon, mail: seat.mail, cinsiyet: seat.cinsiyet, dogumTarihi: seat.dogumTarihi, koltukDurum: seat.koltukDurum })
                    })
                    setPlanePlan(newPlan)
                    localStorage.setItem("plan",JSON.stringify(newPlan))
                    localStorage.setItem("selectedSeats",JSON.stringify(selectedSeat))
                }
                showDetail(selectedSeat.length)
            }
            else {
                onOpen("selectedSeatFull")
            }
        }
    }
    const submit = () => {
        localStorage.clear()
        onOpen("success")
    }

    return (
        <div className="bg-white flex w-full h-full max-h-screen min-h-screen overflow-auto p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <div className="bg-slate-200 w-full h-fill bg-planeBg bg-no-repeat bg-center bg-cover">
                <div className="w-full h-full flex flex-wrap justify-center items-center">
                    <div className="min-w-[100px] w-[80px] flex flex-wrap gap-2">
                        {planePlan.map((item, index) => {

                            var buttonClass = "w-[10px] h-[20px] border-[1px] border-black tooltip ";
                            switch (item.koltukDurum) {
                                case 0:
                                    buttonClass += "bg-white text-black "
                                    break;
                                case 1:
                                    buttonClass += "bg-slate-500  text-white"
                                    break;
                                case 2:
                                    buttonClass += "bg-yellow-500 text-white"
                                    break;
                            }
                            if((index+1)%2==0 && (index+1)%4!==0){
                                buttonClass+=" mr-[20px]"
                            }
                            return (
                                <button onClick={() => { fillSeat(index) }} key={index} className={buttonClass}>
                                    {item.koltukDurum == 1 && (
                                        <div key={index} className="tooltiptext">{item.isim} {item.soyisim}</div>
                                    )}
                                    {item.koltukDurum==0 && (
                                        <div key={index} className="tooltiptext">{index+1}</div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="w-full h-full overflow-auto flex flex-col text-black px-8">
                <Form action={submit} className="h-full">
                    <div className="w-full ">
                        <div className="w-full p-6  bg-slate-300 flex flex-row justify-between ">
                            <div className="text-black text-base font-semibold">1.Yolcu</div>
                            {showPassengerDetail1 ? <ChevronDown size={25} fontWeight={800} color="white" /> : <ChevronRight size={25} fontWeight={800} color="white" />}
                        </div>
                        {showPassengerDetail1 && (
                            <div className="flex flex-wrap mt-4 text-black">
                                <div className="w-1/2 flex flex-col pr-2 ">
                                    <div className="text-base text-black font-medium">İsim</div>
                                    <input type="text" onChange={(e) => { handleChange(e, 1) }} name="isim" value={passenger1.isim} required maxLength={50} className="w-full border-2 px-2  border-slate-200"></input>
                                </div>
                                <div className="w-1/2 flex flex-col pr-2">
                                    <div className="text-base text-black font-medium">Soyisim</div>
                                    <input type="text" onChange={(e) => { handleChange(e, 1) }} name="soyisim" value={passenger1.soyisim} required maxLength={50} className="w-full border-2 px-2  border-slate-200"></input>
                                </div>
                                <div className="w-1/2 flex flex-col pr-2 ">
                                    <div className="text-base text-black font-medium">Telefon</div>
                                    <input type="tel" onChange={(e) => { handleChange(e, 1) }} name="telefon" value={passenger1.telefon} required className="w-full border-2 px-2  border-slate-200"></input>
                                </div>
                                <div className="w-1/2 flex flex-col pr-2">
                                    <div className="text-base text-black font-medium">E-Posta</div>
                                    <input type="email" onChange={(e) => { handleChange(e, 1) }} name="mail" value={passenger1.mail} required className="w-full border-2 px-2  border-slate-200"></input>
                                </div>
                                <div className="w-1/2 flex flex-col pr-2 ">
                                    <div className="text-base text-black font-medium">Cinsiyet</div>
                                    <select onChange={(e) => handleChange(e, 1)} name="cinsiyet" value={passenger1.cinsiyet} className="w-full h-full border-2 px-2  border-slate-200" required >
                                        <option value={"0"}>Cinsiyet</option>
                                        <option value={"1"}>Erkek</option>
                                        <option value={"2"}>Kadın</option>
                                    </select>
                                </div>
                                <div className="w-1/2 flex flex-col pr-2">
                                    <div className="text-base text-black font-medium">Doğum Tarihi</div>
                                    <input type="date" onChange={(e) => handleChange(e, 1)} name="dogumTarihi" value={passenger1.dogumTarihi.toString()} required className="w-full border-2 px-2  border-slate-200"></input>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-full mt-5">
                        <div className="w-full p-6  bg-slate-300 flex flex-row justify-between ">
                            <div className="text-black text-base font-semibold">2.Yolcu</div>
                            {showPassengerDetail2 ? <ChevronDown size={25} fontWeight={800} color="white" /> : <ChevronRight size={25} fontWeight={800} color="white" />}
                        </div>
                        {showPassengerDetail2 && (
                            <div className="flex flex-wrap mt-4 text-black">
                                <div className="w-1/2 flex flex-col pr-2 ">
                                    <div className="text-base text-black font-medium">İsim</div>
                                    <input type="text" onChange={(e) => { handleChange(e, 2) }} name="isim" value={passenger2.isim} required maxLength={50} className="w-full border-2 px-2  border-slate-200"></input>
                                </div>
                                <div className="w-1/2 flex flex-col pr-2">
                                    <div className="text-base text-black font-medium">Soyisim</div>
                                    <input type="text" onChange={(e) => { handleChange(e, 2) }} name="soyisim" value={passenger2.soyisim} required maxLength={50} className="w-full border-2 px-2  border-slate-200"></input>
                                </div>
                                <div className="w-1/2 flex flex-col pr-2 ">
                                    <div className="text-base text-black font-medium">Telefon</div>
                                    <input type="tel" onChange={(e) => { handleChange(e, 2) }} name="telefon" value={passenger2.telefon} required className="w-full border-2 px-2  border-slate-200"></input>
                                </div>
                                <div className="w-1/2 flex flex-col pr-2">
                                    <div className="text-base text-black font-medium">E-Posta</div>
                                    <input type="email" onChange={(e) => { handleChange(e, 2) }} name="mail" value={passenger2.mail} required className="w-full border-2 px-2  border-slate-200"></input>
                                </div>
                                <div className="w-1/2 flex flex-col pr-2 ">
                                    <div className="text-base text-black font-medium">Cinsiyet</div>
                                    <select onChange={(e) => handleChange(e, 2)} name="cinsiyet" value={passenger2.cinsiyet} className="w-full h-full border-2 px-2  border-slate-200" required >
                                        <option value={"0"}>Cinsiyet</option>
                                        <option value={"1"}>Erkek</option>
                                        <option value={"2"}>Kadın</option>
                                    </select>
                                </div>
                                <div className="w-1/2 flex flex-col pr-2">
                                    <div className="text-base text-black font-medium">Doğum Tarihi</div>
                                    <input type="date" onChange={(e) => handleChange(e, 2)} name="dogumTarihi" value={passenger2.dogumTarihi.toString()} required className="w-full border-2 px-2  border-slate-200"></input>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-full mt-5">
                        <div className="w-full p-6  bg-slate-300 flex flex-row justify-between ">
                            <div className="text-black text-base font-semibold">3.Yolcu</div>
                            {showPassengerDetail3 ? <ChevronDown size={25} fontWeight={800} color="white" /> : <ChevronRight size={25} fontWeight={800} color="white" />}
                        </div>
                        {showPassengerDetail3 && (
                            <div className="flex flex-wrap mt-4 text-black">
                                <div className="w-1/2 flex flex-col pr-2 ">
                                    <div className="text-base text-black font-medium">İsim</div>
                                    <input type="text" onChange={(e) => { handleChange(e, 3) }} name="isim" value={passenger3.isim} required maxLength={50} className="w-full border-2 px-2  border-slate-200"></input>
                                </div>
                                <div className="w-1/2 flex flex-col pr-2">
                                    <div className="text-base text-black font-medium">Soyisim</div>
                                    <input type="text" onChange={(e) => { handleChange(e, 3) }} name="soyisim" value={passenger3.soyisim} required maxLength={50} className="w-full border-2 px-2  border-slate-200"></input>
                                </div>
                                <div className="w-1/2 flex flex-col pr-2 ">
                                    <div className="text-base text-black font-medium">Telefon</div>
                                    <input type="tel" onChange={(e) => { handleChange(e, 3) }} name="telefon" value={passenger3.telefon} required className="w-full border-2 px-2  border-slate-200"></input>
                                </div>
                                <div className="w-1/2 flex flex-col pr-2">
                                    <div className="text-base text-black font-medium">E-Posta</div>
                                    <input type="email" onChange={(e) => { handleChange(e, 3) }} name="mail" value={passenger3.mail} required className="w-full border-2 px-2  border-slate-200"></input>
                                </div>
                                <div className="w-1/2 flex flex-col pr-2 ">
                                    <div className="text-base text-black font-medium">Cinsiyet</div>
                                    <select onChange={(e) => handleChange(e, 3)} name="cinsiyet" value={passenger3.cinsiyet} className="w-full h-full border-2 px-2  border-slate-200" required >
                                        <option value={"0"}>Cinsiyet</option>
                                        <option value={"1"}>Erkek</option>
                                        <option value={"2"}>Kadın</option>
                                    </select>
                                </div>
                                <div className="w-1/2 flex flex-col pr-2">
                                    <div className="text-base text-black font-medium">Doğum Tarihi</div>
                                    <input type="date" onChange={(e) => handleChange(e, 3)} name="dogumTarihi" value={passenger3.dogumTarihi.toString()} required className="w-full border-2 px-2  border-slate-200"></input>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-full flex justify-center items-center mt-8">
                        <button type="submit" className="bg-slate-300 p-5 w-full font-semibold"> İşlemleri Tamamla</button>
                    </div>
                </Form>
                <div className="mt-8 w-full flex flex-row justify-between px-8 py-4 bg-slate-300">
                    <div className="w-1/2 h-full flex flex-row gap-2">
                        {selectedSeat.length >= 1 && selectedSeat.map((seat, index) => {
                            return (
                                <>
                                    <div key={index} className="w-[30px] h-[40px] border-2 border-black bg-yellow-500 text-white flex justify-center items-center">{seat + 1}</div>
                                </>
                            )
                        })}
                    </div>
                    <div className="w-1/2 h-full flex flex-col">
                        <div className="flex justify-end items-center text-sm gap-2">
                            {selectedSeat.length} X <div className="w-[10px] h-[15px] border-[1px] border-black bg-yellow-500 text-white flex justify-center items-center"></div>
                        </div>
                        <div className="flex justify-end items-center text-xl">
                            {selectedSeat.length * 1000} ₺
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
