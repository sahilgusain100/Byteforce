import Nav from './nav'

const Navbar = ({ variant = 'home' }) => {
  const isMarketplace = variant === 'marketplace'

  return (
    <div
      className={
        isMarketplace
          ? 'bg-primary px-5 py-4 text-white sm:px-8'
          : 'mx-auto flex flex-col gap-3 px-5 py-4 font-serif bg-primary text-white sm:px-8 md:flex-row md:items-center md:justify-between'
      }
    >
      <div
        className={
          isMarketplace
            ? 'mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between'
            : 'contents'
        }
      >
        <a
          className="w-fit rounded-sm font-serif text-2xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          href={isMarketplace ? '/' : '#top'}
        >
          SkillBridge
          {isMarketplace && (
            <span className="ml-2 font-sans text-sm font-normal text-white/70">
              / Marketplace
            </span>
          )}
        </a>
        <Nav variant={variant} />
      </div>
    </div>
  )
}

export default Navbar