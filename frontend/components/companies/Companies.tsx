const Companies = () => {
    return (
        <div className="bg-white py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                <div className="mb-4 flex flex-col items-center md:mb-8 lg:flex-row lg:justify-between">
                    <h2 className="mb-2 text-center text-2xl font-bold text-gray-800 lg:mb-0 lg:text-3xl">Our Tech Stack</h2>

                </div>

                <div className="grid grid-cols-2 gap-4 rounded-lg md:grid-cols-3 lg:gap-6">
                    <div className="flex h-16 items-center justify-center rounded-lg bg-gray-100 p-4 text-gray-400 sm:h-32">
                        <img className="object-contain w-full h-full" src="https://g.foolcdn.com/art/companylogos/square/link.png" alt="Your Image Description" />
                    </div>
                    <div className="flex h-16 items-center justify-center rounded-lg bg-gray-100 p-4 text-gray-400 sm:h-32">
                        <img className="object-contain w-full h-full" src="https://docs.bacalhau.org/img/bacalhau-horizontal.jpg" alt="Your Image Description" />
                    </div>
                    <div className="flex h-16 items-center justify-center rounded-lg bg-gray-100 p-4 text-gray-400 sm:h-32">
                        <img className="object-contain w-full h-full" src="https://semaphore.appliedzkp.org/img/semaphore-logo.svg" alt="Your Image Description" />
                    </div>
                    <div className="flex h-16 items-center justify-center rounded-lg bg-gray-100 p-4 text-gray-400 sm:h-32">
                        <img className="object-contain w-full h-full" src="https://miro.medium.com/v2/resize:fit:1400/1*VnBroXude86uW7GMPX1esQ.png" alt="Your Image Description" />
                    </div>
                    <div className="flex h-16 items-center justify-center rounded-lg bg-gray-100 p-4 text-gray-400 sm:h-32">
                        <img className="object-contain w-full h-full" src="https://www.numerama.com/wp-content/uploads/2023/05/worldcoin.jpg" alt="Your Image Description" />
                    </div>
                    <div className="flex h-16 items-center justify-center rounded-lg bg-gray-100 p-4 text-gray-400 sm:h-32">
                        <img className="object-contain w-full h-full" src="https://pbs.twimg.com/profile_images/1616124968265302024/mhT50NcT_400x400.jpg" alt="Your Image Description" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Companies;