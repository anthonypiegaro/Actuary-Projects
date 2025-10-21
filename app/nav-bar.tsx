"use client"

import Link from "next/link"
import { Rose } from "lucide-react"
import { LuGithub } from "react-icons/lu"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu"

const projects = [
  {
    title: "Loan Calculator",
    href: "/projects/loan-calculator",
    description:
      "Compute loan payments and amortization schedules with adjustable rates and terms.",
  },
  {
    title: "Investment Calculator",
    href: "/projects/investment-calculator",
    description:
      "Model future value of savings under varying compounding and inflation scenarios.",
  },
  {
    title: "Annuity Calculator",
    href: "",
    description:
      "Estimate present and future values of fixed and variable annuity cash flows.",
  },
  {
    title: "Bond Valuation and Duration",
    href: "",
    description:
      "Price bonds and analyze interest rate sensitivity using duration and convexity metrics.",
  },
  {
    title: "Pension Fund Model",
    href: "",
    description:
      "Project retirement fund growth and liabilities under different contribution strategies.",
  },
  {
    title: "Insurance Company Reserve Tool",
    href: "",
    description:
      "Estimate policy reserves using discounted cash flows and expected claim patterns.",
  }
]

const resources = [
  {
    title: "SOA",
    href: "https://www.soa.org/",
    description:
      "Professional association for actuaries in life, health, and pensions.",
  },
  {
    title: "CAS",
    href: "https://www.casact.org/",
    description:
      "Association specializing in property and casualty actuarial work.",
  },
  {
    title: "Be An Actuary",
    href: "https://www.beanactuary.org/",
    description: "Learn how to start, study, and succeed as an actuary.",
  },
]

const dataSources = [
  {
    title: "Human Mortality Database",
    href: "https://www.mortality.org/",
    description: "Provides detailed mortality and population data for countries around the world, maintained by the University of California, Berkeley, and the Max Planck Institute for Demographic Research."
  },
  {
    title: "US Open Data Portal",
    href: "https://data.gov/",
    description: "The official open data portal of the United States government, offering datasets across domains such as health, environment, education, and public safety."
  },
  {
    title: "CDC Mortality Data (NVSS)",
    href: "https://www.cdc.gov/nchs/nvss/deaths.htm",
    description: "Mortality statistics compiled by the National Vital Statistics System (NVSS) of the CDC, providing public health data on deaths, causes, and life expectancy in the United States."
  },
  {
    title: "Centers for Medicare & Medicaid Services (CMS) Data",
    href: "https://data.cms.gov/",
    description:
      "Extensive U.S. healthcare and insurance payment data."
  },
  {
    title: "FEMA Open Data (OpenFEMA)",
    href: "https://www.fema.gov/about/reports-and-data/openfema",
    description: "Open U.S. disaster and insurance claim datasets."
  },
  {
    title: "FRED (Federal Reserve Economic Data)",
    href: "https://fred.stlouisfed.org/",
    description: "Comprehensive U.S. macroeconomic indicators such as interest rates, inflation, and employment."
  },
  {
    title: "World Bank Open Data",
    href: "https://data.worldbank.org/",
    description: "Global economic, demographic, and development statistics."
  },
  {
    title: "Kaggle Datasets",
    href: "https://www.kaggle.com/datasets",
    description: "Diverse user-contributed datasets including insurance pricing, health claims, and risk modeling examples."
  }
]

export function NavBar() {
  return (
    <nav className="fixed top-0 left-1/2 -translate-x-1/2 w-[calc(100dvw-(--spacing(4)))] max-w-4xl p-3 border-2 border-t-0 border-black/35 dark:border-white/35 rounded-b-lg flex justify-between items-center bg-black/30 dark:bg-white/30 backdrop-blur-lg z-[10000]">
      <Link href="/">
        <Rose className="w-8 h-8"/>
      </Link>
      <Menu />
      <div className="flex items-center gap-x-1">
        <Button
          size="icon"
          variant="ghost"
          className="cursor-pointer text-foreground/80 dark:text-foreground relative flex items-center justify-center transition-all duration-300 rounded-md hover:bg-accent/50 hover:text-accent-foreground dark:hover:bg-accent/50 p-1"
          asChild
        >
          <a href="https://github.com/anthonypiegaro" target="_blank">
            <LuGithub className="size-7" />
          </a>
        </Button>
        <ThemeToggle size="size-7" />
      </div>
    </nav>
  )
}

function Menu() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-md bg-transparent hover:bg-black/30 focus:bg-black/30 data-[state=open]:bg-black/20 data-[state=open]:hover:bg-black/20 data-[state=open]:focus:bg-black/20">
            Projects
          </NavigationMenuTrigger>
          <NavigationMenuContent className="border-black/35 dark:border-white/35 !bg-[oklch(0.8_0_0)] dark:!bg-[oklch(0.45_0_255)]">
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {projects.map(project => (
                <ListItem
                  key={project.title}
                  title={project.title}
                  href={project.href}
                >
                  {project.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-md bg-transparent hover:bg-black/30 focus:bg-black/30 data-[state=open]:bg-black/20 data-[state=open]:hover:bg-black/20 data-[state=open]:focus:bg-black/20">
            Data
          </NavigationMenuTrigger>
          <NavigationMenuContent className="border-black/35 dark:border-white/35 !bg-[oklch(0.8_0_0)] dark:!bg-[oklch(0.45_0_255)]">
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {dataSources.map(source => (
                <li key={source.title}>
                  <NavigationMenuLink className="hover:bg-black/20" asChild>
                    <a href={source.href} target="_blank">
                      <div className="text-sm leading-none font-medium truncate">{source.title}</div>
                      <p className="text-[oklch(0.3_0_0)] dark:text-[oklch(0.7_0_255)] line-clamp-2 text-sm leading-snug">
                        {source.description}
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-md bg-transparent hover:bg-black/30 focus:bg-black/30 data-[state=open]:bg-black/20 data-[state=open]:hover:bg-black/20 data-[state=open]:focus:bg-black/20">
            Resources
          </NavigationMenuTrigger>
          <NavigationMenuContent className="border-black/35 dark:border-white/35 !bg-[oklch(0.8_0_0)] dark:!bg-[oklch(0.45_0_255)]">
            <ul className="grid w-[300px]">
              {resources.map(resource => (
                <li key={resource.title}>
                  <NavigationMenuLink className="hover:bg-black/20" asChild>
                    <a href={resource.href} target="_blank">
                      <div className="text-sm leading-none font-medium">{resource.title}</div>
                      <div className="text-sm text-[oklch(0.3_0_0)] dark:text-[oklch(0.7_0_255)] leading-snug">
                        {resource.description}
                      </div>
                    </a>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink className="hover:bg-black/20" asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium truncate">{title}</div>
          <p className="text-[oklch(0.3_0_0)] dark:text-[oklch(0.7_0_255)] line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
