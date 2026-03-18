import styled, { keyframes } from 'styled-components';
import {
  HiOutlineHomeModern,
  HiOutlineUsers,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
  HiOutlineCheckCircle,
  HiOutlineSparkles,
  HiOutlineMoon,
} from 'react-icons/hi2';
import Heading from '../components/Heading';
import Row from '../components/Row';
import Spinner from '../components/Spinner';
import DashboardFilter from '../features/dashboard/DashboardFilter';
import DashboardLayout from '../features/dashboard/DashboardLayout';
import Stats from '../features/dashboard/Stats';
import SalesChart from '../features/dashboard/SalesChart';
import DurationChart from '../features/dashboard/DurationChart';
import CabinCollage from '../features/dashboard/CabinCollage';
import Today from '../features/check-in-out/TodayActivity';
import { useRecentBookings } from '../features/dashboard/useRecentBookings';
import { useRecentStays } from '../features/dashboard/useRecentStays';
import { useCabins } from '../features/cabins/useCabins';
import { useCurrentUser } from '../features/authentication/useCurrentUser';

/* ─── Shared ─────────────────────────────────────────────────────────────── */
const FullWidthLoader = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 0;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
`;

/* ─── Landing page styled components ─────────────────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const LandingWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6rem;
  padding-bottom: 6rem;
  animation: ${fadeUp} 0.55s ease both;
`;

const Hero = styled.section`
  background: linear-gradient(
    135deg,
    var(--color-brand-600) 0%,
    var(--color-brand-800) 100%
  );
  border-radius: var(--border-radius-lg);
  padding: 5.6rem 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -40%;
    right: -15%;
    width: 40rem;
    height: 40rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 28rem;
    height: 28rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    pointer-events: none;
  }
`;

const HeroIcon = styled.div`
  width: 7.2rem;
  height: 7.2rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: grid;
  place-items: center;
  border: 2px solid rgba(255, 255, 255, 0.25);

  & svg {
    width: 3.6rem;
    height: 3.6rem;
    color: #fff;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3.6rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
  line-height: 1.15;
`;

const HeroSub = styled.p`
  font-size: 1.7rem;
  color: rgba(255, 255, 255, 0.82);
  max-width: 56rem;
  line-height: 1.65;
`;

const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.4rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 100vw;
  font-size: 1.3rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.3px;

  & svg {
    width: 1.4rem;
    height: 1.4rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--color-grey-800);
  text-align: center;
  margin-bottom: 0.6rem;
`;

const SectionSub = styled.p`
  font-size: 1.5rem;
  color: var(--color-grey-500);
  text-align: center;
  max-width: 54rem;
  margin: 0 auto 3.2rem;
  line-height: 1.6;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(28rem, 1fr));
  gap: 2.4rem;
`;

const FeatureCard = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.8rem 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  transition:
    box-shadow 0.25s,
    transform 0.25s;
  animation: ${fadeUp} 0.55s ease both;
  animation-delay: ${(p) => p.$delay || '0s'};

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-3px);
  }
`;

const FeatureIconWrap = styled.div`
  width: 4.8rem;
  height: 4.8rem;
  border-radius: var(--border-radius-md);
  background: linear-gradient(
    135deg,
    var(--color-brand-100) 0%,
    var(--color-brand-50) 100%
  );
  display: grid;
  place-items: center;
  border: 1px solid var(--color-brand-200);

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-brand-600);
  }
`;

const FeatureName = styled.h3`
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-grey-800);
`;

const FeatureDesc = styled.p`
  font-size: 1.4rem;
  color: var(--color-grey-500);
  line-height: 1.6;
`;

const FeatureBullets = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 0.4rem;
`;

const Bullet = styled.li`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.3rem;
  color: var(--color-grey-600);

  & svg {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--color-brand-500);
    flex-shrink: 0;
  }
`;

const StatsStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1.6rem;
`;

const StatBox = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem;
  text-align: center;
  animation: ${fadeUp} 0.55s ease both;
  animation-delay: ${(p) => p.$delay || '0s'};
`;

const StatNumber = styled.div`
  font-size: 3.2rem;
  font-weight: 800;
  color: var(--color-brand-600);
  font-family: 'Sono', monospace;
  line-height: 1;
  margin-bottom: 0.6rem;
`;

const StatLabel = styled.div`
  font-size: 1.3rem;
  color: var(--color-grey-500);
  font-weight: 500;
`;

/* ─── Feature data ──────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <HiOutlineHomeModern />,
    name: 'Cabin Management',
    desc: 'View all available cabins with real-time availability, pricing details, and rich imagery. Explore individual cabin profiles and plan your perfect stay.',
    bullets: [
      'Browse all cabin listings',
      'Check live availability',
      'View pricing & capacity',
    ],
  },
  {
    icon: <HiOutlineCalendarDays />,
    name: 'Smart Booking System',
    desc: 'Create and track bookings with ease. The system handles date conflict detection, pricing breakdowns, and breakfast add-ons automatically.',
    bullets: [
      'Conflict-free date selection',
      'Auto price calculation',
      'Breakfast & extras',
    ],
  },
  {
    icon: <HiOutlineUsers />,
    name: 'Guest Profiles',
    desc: 'Every guest gets a dedicated profile with their personal details, nationality, and booking history — giving staff everything they need at a glance.',
    bullets: [
      'Guest directory',
      'Nationality & ID tracking',
      'Booking history',
    ],
  },
  {
    icon: <HiOutlineCheckCircle />,
    name: 'Check-in / Check-out',
    desc: 'Streamlined arrival and departure flows. Confirm bookings, mark guests as checked in, collect payments, and complete check-outs in just a few clicks.',
    bullets: [
      'One-click check-in',
      'Payment confirmation',
      'Smooth check-out flow',
    ],
  },
  {
    icon: <HiOutlineChartBar />,
    name: 'Analytics & Reports',
    desc: 'Visual sales charts, duration-of-stay breakdowns, and real-time revenue statistics give management a clear, instant view of business performance.',
    bullets: [
      'Revenue over time',
      'Stay duration charts',
      'Occupancy insights',
    ],
  },
  {
    icon: <HiOutlineCog6Tooth />,
    name: 'Flexible Settings',
    desc: 'Administrators can configure minimum and maximum stay lengths, maximum guests per booking, and daily breakfast pricing — all in one place.',
    bullets: ['Min / max stay rules', 'Breakfast price', 'Capacity controls'],
  },
];

/* ─── Landing page for non-admin users ───────────────────────────────────── */
const WildOasisLanding = () => (
  <LandingWrap>
    {/* Hero */}
    <Hero>
      <HeroIcon>
        <HiOutlineSparkles />
      </HeroIcon>
      <HeroBadge>
        <HiOutlineMoon />
        Premium Boutique Hotel
      </HeroBadge>
      <HeroTitle>Welcome to The Wild Oasis</HeroTitle>
      <HeroSub>
        An exclusive collection of luxury wooden cabins nestled in nature.
        Discover the perfect escape — serene landscapes, world-class amenities,
        and unforgettable experiences await you.
      </HeroSub>
    </Hero>

    {/* Stats strip */}
    <div>
      <SectionTitle>By the numbers</SectionTitle>
      <SectionSub>A snapshot of what makes The Wild Oasis special</SectionSub>
      <StatsStrip>
        {[
          { num: '8', label: 'Luxury Cabins' },
          { num: '100%', label: 'Eco-Friendly' },
          { num: '24/7', label: 'Concierge Service' },
          { num: '★ 4.9', label: 'Guest Rating' },
        ].map(({ num, label }, i) => (
          <StatBox key={label} $delay={`${i * 0.08}s`}>
            <StatNumber>{num}</StatNumber>
            <StatLabel>{label}</StatLabel>
          </StatBox>
        ))}
      </StatsStrip>
    </div>

    {/* Features grid */}
    <div>
      <SectionTitle>Everything you need, in one place</SectionTitle>
      <SectionSub>
        The Wild Oasis management platform covers every aspect of running a
        boutique cabin hotel — from bookings to analytics.
      </SectionSub>
      <FeaturesGrid>
        {FEATURES.map(({ icon, name, desc, bullets }, i) => (
          <FeatureCard key={name} $delay={`${i * 0.07}s`}>
            <FeatureIconWrap>{icon}</FeatureIconWrap>
            <FeatureName>{name}</FeatureName>
            <FeatureDesc>{desc}</FeatureDesc>
            <FeatureBullets>
              {bullets.map((b) => (
                <Bullet key={b}>
                  <HiOutlineCheckCircle />
                  {b}
                </Bullet>
              ))}
            </FeatureBullets>
          </FeatureCard>
        ))}
      </FeaturesGrid>
    </div>
  </LandingWrap>
);

/* ─── Admin dashboard ────────────────────────────────────────────────────── */
const AdminDashboard = () => {
  const {
    bookings,
    isLoading: isLoadingBookings,
    numDays,
  } = useRecentBookings();
  const { confirmedStays, isLoading: isLoadingStays } = useRecentStays();
  const { cabins, isLoading: isLoadingCabins } = useCabins();
  const isLoadingStats = isLoadingBookings || isLoadingStays || isLoadingCabins;

  return (
    <>
      <Row type='horizontal'>
        <Heading as='h1'>Dashboard</Heading>
        <DashboardFilter />
      </Row>

      <DashboardLayout>
        {isLoadingStats ? (
          <FullWidthLoader>
            <Spinner />
          </FullWidthLoader>
        ) : (
          <Stats
            bookings={bookings}
            confirmedStays={confirmedStays}
            numDays={numDays}
            cabinCount={cabins?.length}
          />
        )}

        <Today />
        <DurationChart confirmedStays={confirmedStays ?? []} />
        <SalesChart bookings={bookings ?? []} numDays={numDays} />
        <CabinCollage />
      </DashboardLayout>
    </>
  );
};

/* ─── Default export — picks view based on role ──────────────────────────── */
const Dashboard = () => {
  const { user, isLoading } = useCurrentUser();
  if (isLoading) return <Spinner />;
  return user?.role === 'admin' ? <AdminDashboard /> : <WildOasisLanding />;
};

export default Dashboard;
