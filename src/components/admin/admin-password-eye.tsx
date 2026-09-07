import {adminLogin} from "@/components/admin/admin-ui";
import {loginPasswordEyeSlashed} from "@/lib/admin/admin-login-layout";

type AdminPasswordEyeProps = {
    visible: boolean;
};

/** Figma login/accept-invite eye (outline + pupil); slash while the value is in the clear. */
export function AdminPasswordEye({visible}: AdminPasswordEyeProps) {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className={adminLogin.eyeImage}
        >
            <path
                d="M1.37447 7.76866C1.31891 7.91833 1.31891 8.08298 1.37447 8.23266C1.9156 9.54475 2.83415 10.6666 4.01365 11.4561C5.19315 12.2455 6.5805 12.6669 7.9998 12.6669C9.41911 12.6669 10.8065 12.2455 11.986 11.4561C13.1655 10.6666 14.084 9.54475 14.6251 8.23266C14.6807 8.08298 14.6807 7.91833 14.6251 7.76866C14.084 6.45656 13.1655 5.33468 11.986 4.54525C10.8065 3.75583 9.41911 3.3344 7.9998 3.3344C6.5805 3.3344 5.19315 3.75583 4.01365 4.54525C2.83415 5.33468 1.9156 6.45656 1.37447 7.76866Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <circle
                cx="8"
                cy="8"
                r="2"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            {loginPasswordEyeSlashed(visible) ? (
                <path
                    d="M3.2 12.8 12.8 3.2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
            ) : null}
        </svg>
    );
}
