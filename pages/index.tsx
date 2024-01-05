import Image from 'next/image'
import { Inter } from 'next/font/google'
import Button from '@/components/login-btn'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  async function callApi() {
    const response = await fetch("api/hello");
    console.log(response)
  }

  return (
    <div>
    <Button/>
    <div/>
    <button onClick={() => callApi()}>API</button>
    </div>
  )
}
