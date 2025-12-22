import { useState } from "react"

export default function MessageInput({ send }: { send: (val: string) => void }) {
    const [value, setValue] = useState("");

    return (<>
        <input type="text" className="form-control" onChange={(e) => setValue(e.target.value)} placeholder="Type your message..." value={value} />
        <button type='submit' className='btn btn-primary mt-4' onClick={() => { send(value); setValue('') }}>Send</button>
    </>)
}