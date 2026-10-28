import React from 'react';
import { VehicleType } from '../types/dispatch';

interface VehicleGraphicProps {
  type?: VehicleType;
  view?: 'top-down' | 'side' | 'isometric';
  color?: string;
  className?: string;
}

export const VehicleGraphic: React.FC<VehicleGraphicProps> = ({
  type = 'jumbo',
  view = 'top-down',
  color = '#002D72',
  className = '',
}) => {
  // 1. TOP-DOWN VIEW (Used in the Yard bays grid)
  if (view === 'top-down') {
    if (type === 'trella') {
      // تريلا (Heavy Tractor + 40ft Semi-Trailer Top-Down)
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg
            viewBox="0 0 100 230"
            className="w-full h-full drop-shadow-md select-none transition-transform duration-200"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground Shadow */}
            <rect x="10" y="8" width="80" height="214" rx="8" fill="rgba(15, 23, 42, 0.22)" />

            {/* TRACTOR TIRES */}
            {/* Front Steer Tires */}
            <rect x="8" y="24" width="8" height="20" rx="3" fill="#0F172A" />
            <rect x="84" y="24" width="8" height="20" rx="3" fill="#0F172A" />
            {/* Tractor Tandem Drive Tires */}
            <rect x="7" y="68" width="9" height="18" rx="2" fill="#0F172A" />
            <rect x="84" y="68" width="9" height="18" rx="2" fill="#0F172A" />
            <rect x="7" y="88" width="9" height="18" rx="2" fill="#0F172A" />
            <rect x="84" y="88" width="9" height="18" rx="2" fill="#0F172A" />

            {/* TRAILER REAR TANDEM TIRES */}
            <rect x="6" y="180" width="10" height="20" rx="2" fill="#0F172A" />
            <rect x="84" y="180" width="10" height="20" rx="2" fill="#0F172A" />
            <rect x="6" y="202" width="10" height="20" rx="2" fill="#0F172A" />
            <rect x="84" y="202" width="10" height="20" rx="2" fill="#0F172A" />

            {/* TRACTOR CAB */}
            <path
              d="M18 16 Q50 10 82 16 L84 66 L16 66 Z"
              fill={color || '#002D72'}
              stroke="#0A2540"
              strokeWidth="1.8"
            />
            {/* Cab Windshield */}
            <path
              d="M24 22 Q50 16 76 22 L74 38 Q50 32 26 38 Z"
              fill="#1E293B"
              stroke="#0F172A"
              strokeWidth="1"
            />
            {/* Cab Roof Sun Visor / Spoiler */}
            <rect x="24" y="40" width="52" height="22" rx="3" fill="#334155" />
            {/* Side Mirrors */}
            <rect x="11" y="22" width="6" height="10" rx="2" fill="#334155" />
            <rect x="83" y="22" width="6" height="10" rx="2" fill="#334155" />

            {/* FIFTH WHEEL COUPLING (Hitch Pivot) */}
            <circle cx="50" cy="84" r="7" fill="#475569" stroke="#1E293B" strokeWidth="2" />
            <rect x="47" y="76" width="6" height="16" fill="#1E293B" />

            {/* TRAILER BODY (40ft Semi-Trailer Bed with Jotun Paints) */}
            <rect
              x="14"
              y="96"
              width="72"
              height="124"
              rx="4"
              fill="#F8FAFC"
              stroke="#64748B"
              strokeWidth="2"
            />

            {/* Jotun Branding Stripe on Trailer Roof */}
            <rect x="15" y="100" width="70" height="12" fill="#002D72" />
            <rect x="15" y="112" width="70" height="4" fill="#FFA300" />
            <text x="50" y="109" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
              JOTUN
            </text>

            {/* Cargo Payload (Paint Pallets / Drums) */}
            <g opacity="0.85">
              <rect x="20" y="124" width="28" height="22" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
              <rect x="52" y="124" width="28" height="22" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
              <rect x="20" y="152" width="28" height="22" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
              <rect x="52" y="152" width="28" height="22" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
              <rect x="20" y="180" width="28" height="22" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
              <rect x="52" y="180" width="28" height="22" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
              {/* Paint Cans Indicators */}
              <circle cx="28" cy="135" r="4" fill="#002D72" />
              <circle cx="40" cy="135" r="4" fill="#FFA300" />
              <circle cx="60" cy="135" r="4" fill="#002D72" />
              <circle cx="72" cy="135" r="4" fill="#EF4444" />
            </g>

            {/* Trailer Rear Safety Bumper */}
            <rect x="18" y="218" width="64" height="4" rx="1" fill="#DC2626" />
          </svg>
        </div>
      );
    }

    if (type === 'dababa') {
      // دبابة (Chevrolet Dababa Single-Cab Pickup Top-Down)
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg
            viewBox="0 0 100 200"
            className="w-full h-full drop-shadow-md select-none transition-transform duration-200"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground Shadow */}
            <rect x="14" y="14" width="72" height="172" rx="12" fill="rgba(15, 23, 42, 0.2)" />

            {/* Tires */}
            <rect x="8" y="38" width="9" height="24" rx="3" fill="#1E293B" />
            <rect x="83" y="38" width="9" height="24" rx="3" fill="#1E293B" />
            <rect x="8" y="142" width="9" height="26" rx="3" fill="#1E293B" />
            <rect x="83" y="142" width="9" height="26" rx="3" fill="#1E293B" />

            {/* Dababa Main Chassis */}
            <rect
              x="17"
              y="18"
              width="66"
              height="164"
              rx="10"
              fill="#F8FAFC"
              stroke="#64748B"
              strokeWidth="2"
            />

            {/* Front Engine Hood (كابوت الدبابة) */}
            <path
              d="M20 20 Q50 15 80 20 L78 50 L22 50 Z"
              fill={color || '#CBD5E1'}
              stroke="#64748B"
              strokeWidth="1.5"
            />
            {/* Front Headlights */}
            <rect x="22" y="18" width="10" height="4" rx="1" fill="#FEF08A" />
            <rect x="68" y="18" width="10" height="4" rx="1" fill="#FEF08A" />

            {/* Windshield */}
            <path
              d="M24 52 Q50 46 76 52 L73 70 Q50 64 27 70 Z"
              fill="#1E293B"
              stroke="#0F172A"
              strokeWidth="1"
            />

            {/* Single Cab Roof */}
            <rect x="25" y="70" width="50" height="24" rx="3" fill="#64748B" />
            {/* Rear Window */}
            <rect x="28" y="94" width="44" height="4" rx="1.5" fill="#1E293B" />

            {/* Side Mirrors */}
            <rect x="12" y="48" width="5" height="10" rx="1.5" fill="#334155" />
            <rect x="83" y="48" width="5" height="10" rx="1.5" fill="#334155" />

            {/* Roll-Bar / Headache Rack (عوارض حماية صندوق الدبابة) */}
            <rect x="21" y="99" width="58" height="4" rx="1" fill="#334155" />

            {/* OPEN CARGO BED (صندوق الدبابة المفتوح) */}
            <rect
              x="20"
              y="105"
              width="60"
              height="74"
              rx="2"
              fill="#334155"
              stroke="#1E293B"
              strokeWidth="1.5"
            />
            {/* Bed Floor Ribs */}
            <line x1="28" y1="108" x2="28" y2="175" stroke="#475569" strokeWidth="2" />
            <line x1="38" y1="108" x2="38" y2="175" stroke="#475569" strokeWidth="2" />
            <line x1="50" y1="108" x2="50" y2="175" stroke="#475569" strokeWidth="2" />
            <line x1="62" y1="108" x2="62" y2="175" stroke="#475569" strokeWidth="2" />
            <line x1="72" y1="108" x2="72" y2="175" stroke="#475569" strokeWidth="2" />

            {/* Loaded Jotun Paint Pails/Tins in Bed */}
            <circle cx="34" cy="122" r="6" fill="#002D72" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="50" cy="122" r="6" fill="#FFA300" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="66" cy="122" r="6" fill="#002D72" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="42" cy="142" r="6" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="58" cy="142" r="6" fill="#002D72" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Rear Tailgate */}
            <rect x="20" y="177" width="60" height="5" rx="1.5" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" />
            {/* Taillights */}
            <rect x="20" y="178" width="6" height="3" fill="#EF4444" />
            <rect x="74" y="178" width="6" height="3" fill="#EF4444" />
          </svg>
        </div>
      );
    }

    // DEFAULT / JUMBO: عربية جامبو (Isuzu Jumbo Medium Box Truck Top-Down)
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 100 200"
          className="w-full h-full drop-shadow-md select-none transition-transform duration-200"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground Shadow */}
          <rect x="12" y="14" width="76" height="176" rx="8" fill="rgba(15, 23, 42, 0.22)" />

          {/* Tires */}
          <rect x="7" y="34" width="9" height="24" rx="3" fill="#1E293B" />
          <rect x="84" y="34" width="9" height="24" rx="3" fill="#1E293B" />
          {/* Dual Rear Wheels (جامبو) */}
          <rect x="6" y="142" width="10" height="26" rx="3" fill="#1E293B" />
          <rect x="84" y="142" width="10" height="26" rx="3" fill="#1E293B" />

          {/* FRONT CAB (كابينة الجامبو المسطحة) */}
          <path
            d="M16 16 Q50 12 84 16 L84 56 L16 56 Z"
            fill={color || '#002D72'}
            stroke="#0A2540"
            strokeWidth="1.8"
          />
          {/* Windshield */}
          <path
            d="M20 20 Q50 15 80 20 L78 36 Q50 31 22 36 Z"
            fill="#1E293B"
            stroke="#0F172A"
            strokeWidth="1"
          />
          {/* Cab Roof Deflector (سبويلر علوي) */}
          <rect x="22" y="38" width="56" height="16" rx="2" fill="#FFA300" />
          <text x="50" y="49" textAnchor="middle" fill="#002D72" fontSize="7" fontWeight="bold">
            JOTUN
          </text>

          {/* Side Mirrors */}
          <rect x="10" y="24" width="6" height="12" rx="2" fill="#334155" />
          <rect x="84" y="24" width="6" height="12" rx="2" fill="#334155" />

          {/* JUMBO ENCLOSED BOX CONTAINER (صندوق الجامبو المغلق) */}
          <rect
            x="14"
            y="58"
            width="72"
            height="128"
            rx="4"
            fill="#FFFFFF"
            stroke="#94A3B8"
            strokeWidth="2"
          />
          {/* Roof Corrugation Lines */}
          <line x1="18" y1="78" x2="82" y2="78" stroke="#E2E8F0" strokeWidth="2" />
          <line x1="18" y1="100" x2="82" y2="100" stroke="#E2E8F0" strokeWidth="2" />
          <line x1="18" y1="122" x2="82" y2="122" stroke="#E2E8F0" strokeWidth="2" />
          <line x1="18" y1="144" x2="82" y2="144" stroke="#E2E8F0" strokeWidth="2" />
          <line x1="18" y1="166" x2="82" y2="166" stroke="#E2E8F0" strokeWidth="2" />

          {/* Jotun Logo Badge on Jumbo Roof */}
          <circle cx="50" cy="112" r="14" fill="#002D72" />
          <text x="50" y="115" textAnchor="middle" fill="#FFA300" fontSize="7" fontWeight="bold">
            JOTUN
          </text>

          {/* Rear Door Trim */}
          <line x1="50" y1="180" x2="50" y2="186" stroke="#64748B" strokeWidth="2" />
          <rect x="16" y="184" width="8" height="3" rx="1" fill="#EF4444" />
          <rect x="76" y="184" width="8" height="3" rx="1" fill="#EF4444" />
        </svg>
      </div>
    );
  }

  // 2. SIDE PROFILE VIEW (Used in cards & detail modal)
  if (type === 'trella') {
    // تريلا (Heavy Semi-Trailer Truck Side Profile)
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 320 140"
          className="w-full h-full drop-shadow-md select-none transition-transform duration-200"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground Contact Shadow */}
          <ellipse cx="160" cy="128" rx="146" ry="8" fill="rgba(15, 23, 42, 0.25)" />

          {/* TRACTOR WHEELS (Front + Dual Rear Tandem) */}
          <circle cx="50" cy="114" r="15" fill="#0F172A" />
          <circle cx="50" cy="114" r="9" fill="#475569" />
          <circle cx="95" cy="114" r="15" fill="#0F172A" />
          <circle cx="95" cy="114" r="9" fill="#475569" />
          <circle cx="125" cy="114" r="15" fill="#0F172A" />
          <circle cx="125" cy="114" r="9" fill="#475569" />

          {/* TRAILER WHEELS (Dual Rear Tandem) */}
          <circle cx="260" cy="114" r="15" fill="#0F172A" />
          <circle cx="260" cy="114" r="9" fill="#475569" />
          <circle cx="292" cy="114" r="15" fill="#0F172A" />
          <circle cx="292" cy="114" r="9" fill="#475569" />

          {/* TRACTOR CABIN (Heavy Duty Semi Tractor) */}
          <path
            d="
              M26 112
              L38 112
              A16 16 0 0 0 62 112
              L80 112
              L80 98
              L138 98
              L138 112
              L15 112
              Q10 112 12 100
              L16 60
              Q18 45 32 38
              L48 30
              L82 30
              L82 98
              Z
            "
            fill={color || '#002D72'}
            stroke="#0A2540"
            strokeWidth="2"
          />

          {/* High Exhaust Stack */}
          <rect x="80" y="16" width="5" height="70" rx="2.5" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
          <path d="M80 18 Q86 12 90 12" stroke="#94A3B8" strokeWidth="3" fill="none" />

          {/* Windshield & Door Window */}
          <path
            d="M36 44 L48 34 L74 34 L74 65 L34 65 Z"
            fill="#1E293B"
            stroke="#0F172A"
            strokeWidth="1.5"
          />

          {/* Fuel Tank under Chassis */}
          <rect x="74" y="102" width="16" height="10" rx="3" fill="#64748B" stroke="#334155" />

          {/* FIFTH WHEEL COUPLING PLATE */}
          <rect x="105" y="94" width="18" height="5" rx="1.5" fill="#334155" />

          {/* TRAILER LANDING GEAR (أرجل تثبيت المقطورة) */}
          <line x1="156" y1="96" x2="156" y2="118" stroke="#475569" strokeWidth="4" />
          <rect x="152" y="116" width="8" height="4" fill="#1E293B" />

          {/* 40ft TRAILER CARGO BODY */}
          <rect
            x="128"
            y="32"
            width="178"
            height="68"
            rx="4"
            fill="#F8FAFC"
            stroke="#64748B"
            strokeWidth="2.5"
          />

          {/* Jotun Paint Corporate Livery Band on Trailer */}
          <rect x="129" y="44" width="176" height="22" fill="#002D72" />
          <rect x="129" y="66" width="176" height="5" fill="#FFA300" />
          <text x="217" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="2">
            JOTUN PAINTS
          </text>

          {/* Trailer Side Guard Bars */}
          <line x1="168" y1="110" x2="240" y2="110" stroke="#94A3B8" strokeWidth="3" />
          <line x1="168" y1="116" x2="240" y2="116" stroke="#94A3B8" strokeWidth="2" />

          {/* Headlights & Taillights */}
          <rect x="12" y="78" width="6" height="12" rx="1" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
          <rect x="303" y="75" width="4" height="20" rx="1" fill="#EF4444" />
        </svg>
      </div>
    );
  }

  if (type === 'dababa') {
    // دبابة (Chevrolet Dababa Single-Cab Pickup Side Profile)
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 280 130"
          className="w-full h-full drop-shadow-md select-none transition-transform duration-200"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground Contact Shadow */}
          <ellipse cx="140" cy="118" rx="122" ry="7" fill="rgba(15, 23, 42, 0.22)" />

          {/* Dababa Wheels */}
          <circle cx="68" cy="104" r="16" fill="#1E293B" />
          <circle cx="68" cy="104" r="10" fill="#64748B" />
          <circle cx="68" cy="104" r="4" fill="#CBD5E1" />

          <circle cx="214" cy="104" r="16" fill="#1E293B" />
          <circle cx="214" cy="104" r="10" fill="#64748B" />
          <circle cx="214" cy="104" r="4" fill="#CBD5E1" />

          {/* Dababa Body Contour */}
          <path
            d="
              M250 102
              L230 102
              A17 17 0 0 0 197 102
              L86 102
              A17 17 0 0 0 52 102
              L26 102
              Q20 102 20 92
              L22 72
              L56 70
              L82 46
              Q88 40 102 40
              L136 40
              L142 66
              L248 66
              Q254 66 254 75
              L252 94
              Q252 102 250 102
              Z
            "
            fill={color || '#F1F5F9'}
            stroke="#64748B"
            strokeWidth="2.5"
          />

          {/* Windshield & Cabin Window */}
          <path
            d="M60 67 L83 45 L130 45 L130 67 Z"
            fill="#1E293B"
            stroke="#0F172A"
            strokeWidth="1.5"
          />

          {/* Driver Door Seam */}
          <line x1="84" y1="46" x2="84" y2="100" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="138" y1="42" x2="138" y2="100" stroke="#94A3B8" strokeWidth="2" />
          <rect x="94" y="74" width="8" height="3" rx="1.5" fill="#334155" />

          {/* Chrome Front Grille & Headlight */}
          <path d="M20 74 L28 72 L28 88 L20 86 Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
          <rect x="18" y="88" width="8" height="12" rx="2" fill="#94A3B8" />

          {/* Dababa Bed Roll-Bar (عوارض حماية كابينة الدبابة) */}
          <path
            d="M142 66 L142 42 L150 42 L158 66"
            fill="none"
            stroke="#1E293B"
            strokeWidth="3.5"
          />

          {/* OPEN CARGO BED SIDE PANEL */}
          <rect
            x="144"
            y="66"
            width="106"
            height="34"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.8"
          />
          {/* Bed Side Embossed Ribs */}
          <line x1="150" y1="78" x2="244" y2="78" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="150" y1="88" x2="244" y2="88" stroke="#CBD5E1" strokeWidth="2" />

          {/* Loaded Paint Gallons / Tins in Bed */}
          <rect x="160" y="52" width="18" height="16" rx="2" fill="#002D72" stroke="#FFFFFF" strokeWidth="1" />
          <rect x="182" y="48" width="20" height="20" rx="2" fill="#FFA300" stroke="#FFFFFF" strokeWidth="1" />
          <rect x="206" y="52" width="18" height="16" rx="2" fill="#002D72" stroke="#FFFFFF" strokeWidth="1" />

          {/* Rear Taillight */}
          <rect x="249" y="72" width="4" height="16" rx="1.5" fill="#EF4444" />
        </svg>
      </div>
    );
  }

  // DEFAULT / JUMBO: عربية جامبو (Isuzu Jumbo Medium Box Truck Side Profile)
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 290 135"
        className="w-full h-full drop-shadow-md select-none transition-transform duration-200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ground Contact Shadow */}
        <ellipse cx="145" cy="122" rx="130" ry="8" fill="rgba(15, 23, 42, 0.22)" />

        {/* Front Wheel */}
        <circle cx="65" cy="108" r="16" fill="#1E293B" />
        <circle cx="65" cy="108" r="10" fill="#64748B" />
        <circle cx="65" cy="108" r="4" fill="#CBD5E1" />

        {/* Dual Rear Wheels (جامبو) */}
        <circle cx="220" cy="108" r="16" fill="#1E293B" />
        <circle cx="220" cy="108" r="10" fill="#64748B" />
        <circle cx="220" cy="108" r="4" fill="#CBD5E1" />

        {/* FRONT JUMBO CAB (كابينة شاحنة جامبو أمامية مسطحة) */}
        <path
          d="
            M24 106
            L48 106
            A17 17 0 0 0 82 106
            L98 106
            L98 40
            L72 32
            L34 32
            Q24 32 24 44
            Z
          "
          fill={color || '#002D72'}
          stroke="#0A2540"
          strokeWidth="2.5"
        />

        {/* Jumbo Roof Air Deflector */}
        <path
          d="M72 32 L98 22 L98 40 Z"
          fill="#FFA300"
          stroke="#D97706"
          strokeWidth="1.5"
        />

        {/* Large Front Windshield & Side Window */}
        <path
          d="M28 42 L65 42 L65 72 L26 72 Z"
          fill="#1E293B"
          stroke="#0F172A"
          strokeWidth="1.5"
        />
        <path
          d="M68 42 L94 42 L94 72 L68 72 Z"
          fill="#1E293B"
          stroke="#0F172A"
          strokeWidth="1.5"
        />

        {/* Side Mirror */}
        <rect x="20" y="44" width="4" height="18" rx="1.5" fill="#334155" />

        {/* Jumbo Chrome Door Handle & Step */}
        <rect x="76" y="80" width="8" height="3" rx="1.5" fill="#CBD5E1" />
        <rect x="52" y="100" width="14" height="4" rx="1" fill="#475569" />

        {/* Headlight & Bumper */}
        <rect x="22" y="82" width="6" height="12" rx="1.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
        <rect x="20" y="96" width="10" height="10" rx="2" fill="#334155" />

        {/* ENCLOSED CARGO BOX CONTAINER (صندوق الجامبو الأبيض بعلامة جوتن) */}
        <rect
          x="102"
          y="24"
          width="164"
          height="82"
          rx="4"
          fill="#FFFFFF"
          stroke="#94A3B8"
          strokeWidth="2.5"
        />

        {/* Jotun Paint Logo on Jumbo Box */}
        <rect x="103" y="38" width="162" height="18" fill="#002D72" />
        <rect x="103" y="56" width="162" height="4" fill="#FFA300" />
        <text x="184" y="51" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
          JOTUN DECORATIVE
        </text>

        {/* Container Ribs / Seams */}
        <line x1="148" y1="62" x2="148" y2="104" stroke="#E2E8F0" strokeWidth="1.8" />
        <line x1="194" y1="62" x2="194" y2="104" stroke="#E2E8F0" strokeWidth="1.8" />
        <line x1="238" y1="62" x2="238" y2="104" stroke="#E2E8F0" strokeWidth="1.8" />

        {/* Underbody Battery Box & Side Underrun Bar */}
        <rect x="124" y="96" width="22" height="10" rx="2" fill="#475569" />
        <line x1="154" y1="102" x2="200" y2="102" stroke="#94A3B8" strokeWidth="3" />

        {/* Rear Taillight */}
        <rect x="264" y="84" width="4" height="16" rx="1.5" fill="#EF4444" />
      </svg>
    </div>
  );
};

// MINIATURE ICON HELPERS FOR BUTTONS & QUICK BADGES
export const TrellaIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Semi Tractor Cab */}
    <path d="M2 17h1v-4a2 2 0 0 1 2-2h3l2 3h2v3h1" />
    <circle cx="5" cy="18" r="2" />
    <circle cx="10" cy="18" r="2" />
    {/* Trailer */}
    <rect x="12" y="8" width="10" height="9" rx="1" />
    <circle cx="15" cy="18" r="2" />
    <circle cx="19" cy="18" r="2" />
  </svg>
);

export const JumboIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Medium Box Truck */}
    <path d="M3 17h1v-6a2 2 0 0 1 2-2h2l2 3h1v5h1" />
    <rect x="11" y="6" width="10" height="11" rx="1" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

export const DababaIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Single Cab Pickup Dababa */}
    <path d="M3 16h2" />
    <path d="M5 16v-4a2 2 0 0 1 2-2h4l2 3h9v3h-1" />
    <line x1="13" y1="13" x2="13" y2="16" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="19" cy="17" r="2" />
  </svg>
);
