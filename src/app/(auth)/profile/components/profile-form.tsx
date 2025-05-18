"use client";
import updateProfileAction from "@/app/actions/auth/update-profile.action";
import DefaultProfile from "@/common/components/default-profile";
import { auth } from "@/common/lib/auth";
import authClient from "@/common/lib/auth-client";
import { devLogger } from "@/common/utils/dev-logger";
import { UploadButton } from "@/common/utils/uploadthing";
import { updateProfileSchema } from "@/common/validations/auth.schema";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import Form from "next/form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";
export type SessionType = Awaited<ReturnType<typeof auth.api.getSession>>;


export default function ProfileForm({ session }: { session: SessionType }) {
  const [lastResult, action, isPending] = useActionState(updateProfileAction, null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(session?.user?.name);
  const [profileImage, setProfileImage] = useState(session?.user?.image);

  const router = useRouter();

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: updateProfileSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  useEffect(() => {
    setUsername(session?.user?.name || "");
    setProfileImage(session?.user?.image || "");
  }, [session?.user?.name, session?.user?.image]);

  useEffect(() => {
    if (lastResult && lastResult.status === "success") {
      setIsEditing(false);
    }
    if (lastResult && form.errors) {
      devLogger.error("Error in form submission", lastResult, form.errors);
      toast.error(form.errors.join(", "));
    }
  }, [lastResult, form.errors, router]);


  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action is irreversible.");

    if (!confirmDelete) {
      toast.error("Account deletion cancelled.");
      return;
    }

    const res = await authClient.deleteUser({
      callbackURL: '/login',
    });

    if (res.error) {
      devLogger.error("Error deleting account", res);
      toast.error(res.error.message || "Something went wrong.");
    } else {
      toast.success("Account deleted successfully.");
      router.push("/login");
      router.refresh();
    }
  };


  const handleEditToggle = (value: boolean): void => {
    setIsEditing(value);
    if (!value) {
      setUsername(session?.user?.name || "");
      setProfileImage(session?.user?.image || "");
    }
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    handleEditToggle(true);
  };

  return (
    <Form
      action={action}
      id={form.id}
      onSubmit={form.onSubmit}
      className="mt-28 w-screen flex flex-col items-center justify-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-center">Profile</h1>
      </div>

      <div className="flex flex-col items-center justify-center">
        {isEditing && (
          <input
            type="hidden"
            name="profileImage"
            value={profileImage!}
          />
        )}
        {session?.user?.image ? (
          <Image
            src={profileImage!}
            alt="Profile"
            width={100}
            height={100}
            className="size-32 rounded-md object-cover pointer-events-none"
          />
        ) : (
          <DefaultProfile
            letter={session?.user?.name?.charAt(0)}
            className="size-32 text-7xl cursor-default hover:bg-accent/50"
          />
        )}
        {isEditing && (
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              devLogger.log("Files: ", res);
              toast.success("Profile picture updated!");
              setProfileImage(res[0].ufsUrl);
            }}
            onUploadError={(error: Error) => {
              devLogger.error("Upload Error: ", error);
              toast.error(error.message || "Error uploading profile picture");
            }}
            appearance={{
              button:
                "bg-accent! ut-button:ut-readying:bg-accent/50! hover:bg-accent-hover! transition! duration-200! disabled:opacity-50! disabled:cursor-not-allowed!",
              allowedContent:
                "text-muted-text/40! font-semibold!",
              container:
                "mt-3"
            }}
          />
        )}
      </div>

      <div className="flex flex-col justify-center gap-6">
        <div>
          {isEditing
            ? (
              <>
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-muted-text"
                >
                  Username:
                </label>
                <input
                  type="text"
                  name={fields.username.name}
                  key={fields.username.key}
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  disabled={isPending}
                  id="username"
                  className="input text-base! h-10! font-semibold"
                />
                {fields.username.errors && (
                  <p className="error-text">{fields.username.errors.join(", ")}</p>
                )}
              </>
            ) : (
              <>
                <span className="text-sm font-medium text-muted-text">Username:</span>
                <p className="font-black">{session?.user?.name}</p>
              </>
            )
          }
        </div>

        <div>
          <span className="text-sm font-medium text-muted-text">Email:</span>
          <p className="font-black">{session?.user?.email}</p>
        </div>

        <div>
          <span className="text-sm font-medium text-muted-text">Cake Day:</span>
          <p className="font-black">
            {session?.user?.createdAt && new Date(session.user.createdAt).toLocaleString()}
          </p>
        </div>

        <div>
          <span className="text-sm font-medium text-muted-text">Last GlowUp:</span>
          <p className="font-black">
            {session?.user?.updatedAt && new Date(session.user.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4 mb-10">
        {isEditing ? (
          <>
            <button
              className="button"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="button-accent"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEditClick}
              className="button"
            >
              Edit Profile
            </button>

            <button
              className="button-accent"
              type="button"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </>
        )}
      </div>
    </Form>
  );
}
