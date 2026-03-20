#!/usr/bin/env python3
"""
@generated
@context Bulk-create BMC Helix catalog products via StartProcessInstanceCommand for com.amar.hssb:Create New Products.
@decisions Session login with requests.Session; credentials from env; billing_cycle_type uses platform values (ONE_OFF, MONTHLY, QUARTERLY, YEARLY); is_active matches sample ("Yes").
@references User-provided REST samples; workspace generation-context-comments.mdc
@modified 2026-03-20
"""
from __future__ import annotations

import json
import os
import sys
import time
from typing import Any

import requests

BASE_URL = os.environ.get("HELIX_BASE_URL", "https://helixone-demo-is.onbmc.com").rstrip("/")
LOGIN_PATH = "/api/rx/authentication/loginrequest"
COMMAND_PATH = "/api/rx/application/command"
PROCESS_NAME = os.environ.get(
    "HELIX_CREATE_PRODUCT_PROCESS",
    "com.amar.hssb:Create New Products",
)

# Billing cycle values per integration table (API-facing).
BILLING = {
    "one_off": "ONE_OFF",
    "monthly": "MONTHLY",
    "quarterly": "QUARTERLY",
    "yearly": "YEARLY",
}

# At least 30 requestable catalog items: hardware, peripherals, cloud, security, SaaS, services.
PRODUCTS: list[dict[str, str]] = [
    # Laptops & workstations
    {
        "product_name": "Business Laptop — 14\" Standard",
        "product_description": "14\" corporate laptop with 16 GB RAM, 512 GB SSD, 3-year warranty.",
        "category": "Hardware",
        "base_price": "1299",
        "currency": "USD",
        "billing_cycle_type": BILLING["one_off"],
    },
    {
        "product_name": "Developer Laptop — 15\" Performance",
        "product_description": "15\" laptop optimized for IDE workloads, 32 GB RAM, 1 TB NVMe.",
        "category": "Hardware",
        "base_price": "2199",
        "currency": "USD",
        "billing_cycle_type": BILLING["one_off"],
    },
    {
        "product_name": "Mobile Workstation — CAD / 3D",
        "product_description": "Certified workstation for CAD/3D; discrete GPU, 64 GB RAM.",
        "category": "Hardware",
        "base_price": "3499",
        "currency": "USD",
        "billing_cycle_type": BILLING["one_off"],
    },
    # Displays & docking
    {
        "product_name": "24\" FHD Monitor (Dual Pack)",
        "product_description": "Two 24\" 1080p monitors with VESA mounts for standard desks.",
        "category": "Peripherals",
        "base_price": "289",
        "currency": "USD",
        "billing_cycle_type": BILLING["one_off"],
    },
    {
        "product_name": "27\" QHD USB-C Monitor",
        "product_description": "27\" QHD display with USB-C docking video and 65 W power delivery.",
        "category": "Peripherals",
        "base_price": "419",
        "currency": "USD",
        "billing_cycle_type": BILLING["one_off"],
    },
    {
        "product_name": "Universal Thunderbolt Dock",
        "product_description": "Thunderbolt dock: dual display, Ethernet, multiple USB-A/C ports.",
        "category": "Peripherals",
        "base_price": "279",
        "currency": "USD",
        "billing_cycle_type": BILLING["one_off"],
    },
    # Input devices & AV
    {
        "product_name": "Ergonomic Keyboard & Mouse Bundle",
        "product_description": "Split ergonomic keyboard and vertical mouse bundle.",
        "category": "Peripherals",
        "base_price": "189",
        "currency": "USD",
        "billing_cycle_type": BILLING["one_off"],
    },
    {
        "product_name": "HD Webcam — Teams Certified",
        "product_description": "1080p webcam with privacy shutter; certified for major UC platforms.",
        "category": "Peripherals",
        "base_price": "129",
        "currency": "USD",
        "billing_cycle_type": BILLING["one_off"],
    },
    {
        "product_name": "Bluetooth Headset — Noise Cancelling",
        "product_description": "Wireless ANC headset with boom mic for open offices.",
        "category": "Peripherals",
        "base_price": "199",
        "currency": "USD",
        "billing_cycle_type": BILLING["one_off"],
    },
    # Storage & accessories
    {
        "product_name": "1 TB Encrypted External SSD",
        "product_description": "Hardware-encrypted portable SSD for sensitive project data.",
        "category": "Peripherals",
        "base_price": "159",
        "currency": "USD",
        "billing_cycle_type": BILLING["one_off"],
    },
    {
        "product_name": "Laptop Carry Case — 15\"",
        "product_description": "Padded corporate laptop bag with organizer and RFID pocket.",
        "category": "Accessories",
        "base_price": "79",
        "currency": "USD",
        "billing_cycle_type": BILLING["one_off"],
    },
    # SaaS & productivity
    {
        "product_name": "Microsoft 365 E3 (per user)",
        "product_description": "Microsoft 365 E3 subscription: Office apps, Exchange Online, Teams.",
        "category": "SaaS",
        "base_price": "36",
        "currency": "USD",
        "billing_cycle_type": BILLING["monthly"],
    },
    {
        "product_name": "Microsoft 365 E5 (per user)",
        "product_description": "E5 suite including advanced security and analytics add-ons.",
        "category": "SaaS",
        "base_price": "57",
        "currency": "USD",
        "billing_cycle_type": BILLING["monthly"],
    },
    {
        "product_name": "Google Workspace Business Plus",
        "product_description": "Google Workspace with enhanced Meet, Vault, and endpoint management.",
        "category": "SaaS",
        "base_price": "18",
        "currency": "USD",
        "billing_cycle_type": BILLING["monthly"],
    },
    {
        "product_name": "Slack Business+ (per user)",
        "product_description": "Slack Business+ with SAML, compliance exports, 99.99% uptime SLA.",
        "category": "SaaS",
        "base_price": "15",
        "currency": "USD",
        "billing_cycle_type": BILLING["monthly"],
    },
    {
        "product_name": "Atlassian Jira Software Cloud (100 users)",
        "product_description": "Jira Software Standard tier for up to 100 licensed users.",
        "category": "SaaS",
        "base_price": "790",
        "currency": "USD",
        "billing_cycle_type": BILLING["monthly"],
    },
    {
        "product_name": "Adobe Creative Cloud All Apps (named user)",
        "product_description": "Full Creative Cloud suite license for design and marketing teams.",
        "category": "SaaS",
        "base_price": "85",
        "currency": "USD",
        "billing_cycle_type": BILLING["monthly"],
    },
    # Cloud infrastructure (commit / list prices as catalog placeholders)
    {
        "product_name": "AWS — Reserved Compute (Small footprint)",
        "product_description": "Pre-approved AWS reserved instance bundle for dev/test (annual commit).",
        "category": "Cloud",
        "base_price": "4800",
        "currency": "USD",
        "billing_cycle_type": BILLING["yearly"],
    },
    {
        "product_name": "AWS — Landing Zone Setup (one-time)",
        "product_description": "One-time professional services for secure AWS account baseline.",
        "category": "Professional Services",
        "base_price": "12500",
        "currency": "USD",
        "billing_cycle_type": BILLING["one_off"],
    },
    {
        "product_name": "Microsoft Azure — Dev/Test Subscription Pack",
        "product_description": "Monthly Azure dev/test subscription with governance guardrails.",
        "category": "Cloud",
        "base_price": "450",
        "currency": "USD",
        "billing_cycle_type": BILLING["monthly"],
    },
    {
        "product_name": "Google Cloud — Shared Billing Project",
        "product_description": "GCP project linked to corporate billing with budget alerts.",
        "category": "Cloud",
        "base_price": "0",
        "currency": "USD",
        "billing_cycle_type": BILLING["monthly"],
    },
    {
        "product_name": "Snowflake — Warehouse Credits (starter)",
        "product_description": "Monthly Snowflake credit allocation for analytics sandbox.",
        "category": "Cloud",
        "base_price": "350",
        "currency": "USD",
        "billing_cycle_type": BILLING["monthly"],
    },
    # Certificates & security
    {
        "product_name": "DigiCert OV TLS Certificate (1-year)",
        "product_description": "Organization-validated TLS certificate for public web properties.",
        "category": "Security",
        "base_price": "249",
        "currency": "USD",
        "billing_cycle_type": BILLING["yearly"],
    },
    {
        "product_name": "DigiCert EV TLS Certificate (1-year)",
        "product_description": "Extended validation TLS certificate for high-trust customer-facing sites.",
        "category": "Security",
        "base_price": "599",
        "currency": "USD",
        "billing_cycle_type": BILLING["yearly"],
    },
    {
        "product_name": "Code Signing Certificate (Organization)",
        "product_description": "OV code signing for internal apps and installers.",
        "category": "Security",
        "base_price": "429",
        "currency": "USD",
        "billing_cycle_type": BILLING["yearly"],
    },
    {
        "product_name": "Endpoint Protection — EDR (per device)",
        "product_description": "Managed EDR agent with 24x7 SOC monitoring option.",
        "category": "Security",
        "base_price": "12",
        "currency": "USD",
        "billing_cycle_type": BILLING["monthly"],
    },
    {
        "product_name": "Password Manager Enterprise (per user)",
        "product_description": "Enterprise password vault with SSO and shared vaults.",
        "category": "Security",
        "base_price": "6",
        "currency": "USD",
        "billing_cycle_type": BILLING["monthly"],
    },
    # Data, backup, identity
    {
        "product_name": "SaaS Backup — M365 (per user)",
        "product_description": "Backup for Exchange, OneDrive, SharePoint, and Teams.",
        "category": "SaaS",
        "base_price": "4",
        "currency": "USD",
        "billing_cycle_type": BILLING["monthly"],
    },
    {
        "product_name": "Okta Workforce Identity (per user)",
        "product_description": "Workforce SSO and lifecycle automation (list price placeholder).",
        "category": "Security",
        "base_price": "8",
        "currency": "USD",
        "billing_cycle_type": BILLING["monthly"],
    },
    # Support & training
    {
        "product_name": "IT Hardware Break/Fix — Next Business Day",
        "product_description": "NBD on-site hardware support contract per covered device.",
        "category": "Support",
        "base_price": "120",
        "currency": "USD",
        "billing_cycle_type": BILLING["yearly"],
    },
    {
        "product_name": "Security Awareness Training (per user, annual)",
        "product_description": "Phishing simulations and annual compliance training seat.",
        "category": "Training",
        "base_price": "35",
        "currency": "USD",
        "billing_cycle_type": BILLING["yearly"],
    },
    {
        "product_name": "Quarterly Penetration Test — Web App",
        "product_description": "External web application pen test with executive summary.",
        "category": "Professional Services",
        "base_price": "8500",
        "currency": "USD",
        "billing_cycle_type": BILLING["quarterly"],
    },
    {
        "product_name": "Vendor Risk Assessment — Standard",
        "product_description": "Third-party risk questionnaire review and scoring (per vendor).",
        "category": "Professional Services",
        "base_price": "1500",
        "currency": "USD",
        "billing_cycle_type": BILLING["one_off"],
    },
    {
        "product_name": "Printer / MFP — Small Office",
        "product_description": "Multifunction laser printer with managed toner replenishment.",
        "category": "Hardware",
        "base_price": "649",
        "currency": "USD",
        "billing_cycle_type": BILLING["one_off"],
    },
    {
        "product_name": "Mobile Phone Stipend Policy (monthly)",
        "product_description": "Approved monthly stipend for BYOD mobile voice/data.",
        "category": "Telecom",
        "base_price": "75",
        "currency": "USD",
        "billing_cycle_type": BILLING["monthly"],
    },
    {
        "product_name": "Zoom Pro (per host, annual prepay)",
        "product_description": "Zoom Pro licenses billed annually for meeting hosts.",
        "category": "SaaS",
        "base_price": "160",
        "currency": "USD",
        "billing_cycle_type": BILLING["yearly"],
    },
    {
        "product_name": "GitHub Enterprise Cloud (per user)",
        "product_description": "GitHub Enterprise Cloud seat with advanced security features.",
        "category": "SaaS",
        "base_price": "21",
        "currency": "USD",
        "billing_cycle_type": BILLING["monthly"],
    },
]


def login(session: requests.Session) -> None:
    user = os.environ.get("HELIX_USERNAME")
    password = os.environ.get("HELIX_PASSWORD")
    if not user or not password:
        print(
            "Set HELIX_USERNAME and HELIX_PASSWORD in the environment.",
            file=sys.stderr,
        )
        sys.exit(1)

    url = f"{BASE_URL}{LOGIN_PATH}"
    headers = {
        "X-Requested-By": "XMLHttpRequest",
        "Content-Type": "application/json",
        "XHttpRequest": "application/json",
    }
    payload = {"userName": user, "password": password}
    resp = session.post(url, headers=headers, json=payload, timeout=60)
    resp.raise_for_status()
    # Helix sets AR-JWT (and others) on the session when Set-Cookie is honored.


def start_create_product(
    session: requests.Session, process_input_values: dict[str, str]
) -> requests.Response:
    url = f"{BASE_URL}{COMMAND_PATH}"
    body: dict[str, Any] = {
        "processDefinitionName": PROCESS_NAME,
        "processInputValues": process_input_values,
        "resourceType": "com.bmc.arsys.rx.application.process.command.StartProcessInstanceCommand",
    }
    headers = {
        "Content-Type": "application/json",
        "X-Requested-By": "XMLHttpRequest",
    }
    return session.post(url, headers=headers, data=json.dumps(body), timeout=120)


def main() -> None:
    session = requests.Session()
    login(session)

    delay = float(os.environ.get("HELIX_REQUEST_DELAY_SEC", "0.35"))
    ok = 0
    fail = 0

    for i, row in enumerate(PRODUCTS, start=1):
        payload_row = {
            "is_active": os.environ.get("HELIX_IS_ACTIVE", "Yes"),
            "base_price": row["base_price"],
            "currency": row["currency"],
            "product_description": row["product_description"],
            "category": row["category"],
            "product_name": row["product_name"],
            "billing_cycle_type": row["billing_cycle_type"],
        }
        r = start_create_product(session, payload_row)
        if r.ok:
            ok += 1
            print(f"[{i}/{len(PRODUCTS)}] OK {row['product_name']}")
        else:
            fail += 1
            print(
                f"[{i}/{len(PRODUCTS)}] FAIL {row['product_name']} "
                f"HTTP {r.status_code}: {r.text[:500]}",
                file=sys.stderr,
            )
        if delay > 0:
            time.sleep(delay)

    print(f"Done. success={ok} failure={fail} total={len(PRODUCTS)}")
    if fail:
        sys.exit(2)


if __name__ == "__main__":
    main()
