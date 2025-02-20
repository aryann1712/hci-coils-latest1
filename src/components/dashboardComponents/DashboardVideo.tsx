import Image from "next/image"

const DashboardVideo = () => {
  return (
    <div>
        {/* <video className='h-[calc(100vh-40px)] w-full object-cover' muted autoPlay loop src='/videos/video.mp4' /> */}
        <Image src="/hero.jpg" alt="" height={2000} width={2000} className="h-[80vh] w-full object-cover"/>
    </div>
  )
}

export default DashboardVideo