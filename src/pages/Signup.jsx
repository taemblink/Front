import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AuthApi } from "../shared/Api";

// 이메일 정규식
const emailRegex =
  /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;

// 이름 정규식
const nameRegex = /^[가-힣]{2,4}$/;
// 한글 이름 2~4자 이내

// 닉네임 정규식
// const nicknameRegex = /^[A-Za-z0-9]{3,}$/;

// 비밀번호 정규식
const passwordRegex = /^.{4,}$/;

// 오류 메세지
const alertMessage = {
  nameErr: "이름 규칙에 어긋납니다! (한글을 사용하여 2글자 이상)",
  // nickErr: "닉네임 규칙에 어긋납니다! (영문과 숫자를 사용하여 3글자 이상)",
  pwErr: "비밀번호 규칙에 어긋납니다!!(4글자 이상)",
  pwMachErr: "패스워드가 불일치합니다.",
  signinUpComplete: "회원가입에 성공했습니다.",
  signinUpFail: "어라? 뭔가 문제가 생긴 것 같아요!",
};

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState({
    value: "",
    err: null,
  });
  // const [korName, setkorName] = useState({
  //   value: "",
  //   err: null,
  // });

  const [name, setName] = useState({
    value: "",
    err: null,
  });

  const [company, setcompany] = useState({
    value: "",
    err: null,
  });

  // const [company, setcompany] = useState({
  //   value: "",
  //   err: null,
  // });

  const [password, setPassword] = useState({
    value: "",
    err: null,
  });
  const [confirmPassword, setConfirmPassword] = useState({
    value: "",
    err: null,
  });

  const [userType, setUserType] = useState("regular"); // Default user type is regular

  const onEmailChangeHandler = (event) => {
    const inputEmail = event.target.value;
    setEmail((prevEmail) => ({
      ...prevEmail,
      value: inputEmail,
    }));
  };

  // const onkorNameChangeHandler = (event) => {
  //   const inputkorName = event.target.value;
  //   setkorName((prevkorName) => ({
  //     ...prevkorName,
  //     value: inputkorName,
  //   }));
  // };

  const onNameChangeHandler = (event) => {
    const inputName = event.target.value;
    setName((prevName) => ({
      ...prevName,
      value: inputName,
    }));
  };

  const oncompanyChangeHandler = (event) => {
    const inputcompany = event.target.value;
    setcompany((prevcompany) => ({
      ...prevcompany,
      value: inputcompany,
    }));
  };

  const onPasswordChangeHandler = (event) => {
    const inputPassword = event.target.value;
    setPassword((prevPassword) => ({
      ...prevPassword,
      value: inputPassword,
    }));
  };

  const onConfirmPasswordChangeHandler = (event) => {
    const inputConfirmPassword = event.target.value;
    setConfirmPassword((prevConfimPw) => ({
      ...prevConfimPw,
      value: inputConfirmPassword,
    }));
  };

  const verifySiginUpData = () => {
    // 유효성 검사 결과 저장
    const verifiedEmail = emailRegex.test(email.value);
    // const verifiedkorname = kornameRegex.test(korName.value);
    const verifiedname = nameRegex.test(name.value);
    const verifiedPassword = passwordRegex.test(password.value);
    const verifiedConfirmPassword = password.value === confirmPassword.value;

    setEmail((prevEmail) => ({
      ...prevEmail,
      err: !verifiedEmail,
    }));

    // setkorName((prevkorName) => ({
    //   ...prevkorName,
    //   err: !verifiedkorname,
    // }));

    setName((prevName) => ({
      ...prevName,
      err: !verifiedname,
    }));
    // 비밀번호 유효성 검사
    setPassword((prevPassword) => ({
      ...prevPassword,
      err: !verifiedPassword,
    }));
    // 비밀번호 재입력 일치 여부 검사
    setConfirmPassword((prevConfimPw) => ({
      ...prevConfimPw,
      err: !verifiedConfirmPassword,
    }));
    return !verifiedname || !verifiedPassword || !verifiedConfirmPassword
      ? false
      : true;
  };
  const onSubmitHandler = async () => {
    const signUpVerify = verifySiginUpData();
    if (signUpVerify) {
      try {
        const payload = {
          email: email.value,
          password: password.value,
          name: name.value,
        };

        if (userType === "regular") {
          payload.user_type = "일반회원";
        } else if (userType === "hr") {
          payload.user_type = "인사담당자";
          payload.company = company.value;
        }

        const res = await AuthApi.signup(payload);
        alert(res.message);
        navigate("/");
      } catch (err) {
        alert(err.errorMessage);
      }
    } else {
      return;
    }
  };

  return (
    <StSignupContainer>
      <h1>회원가입</h1>

      <label>
        사용자 유형 :&nbsp;
        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="regular">일반회원</option>
          <option value="hr">인사담당자</option>
        </select>
      </label>

      <label>
        이메일 :
        <StAlertBox>{email.err ? alertMessage.emailErr : null}</StAlertBox>
      </label>
      <input type="text" placeholder="e-mail" onChange={onEmailChangeHandler} />
      <label>
        이름 :<StAlertBox>{name.err ? alertMessage.nameErr : null}</StAlertBox>
      </label>
      <input type="text" placeholder="name" onChange={onNameChangeHandler} />

      {userType === "hr" && (
        <>
          <label>
            회사명 :
            <StAlertBox>
              {/* {company.err ? alertMessage.nickErr : null} */}
            </StAlertBox>
          </label>
          <input
            type="text"
            placeholder="My company"
            onChange={oncompanyChangeHandler}
          />
        </>
      )}

      <label>
        비밀번호 :
        <StAlertBox>{password.err ? alertMessage.pwErr : null}</StAlertBox>
      </label>
      <input
        type="password"
        placeholder="Password"
        onChange={onPasswordChangeHandler}
      />
      <label>
        비밀번호 재입력 :
        <StAlertBox>
          {confirmPassword.err ? alertMessage.pwMachErr : null}
        </StAlertBox>
      </label>
      <input
        type="password"
        placeholder="Confirm Password"
        onChange={onConfirmPasswordChangeHandler}
      />
      <div>
        <StBtnSubmit backgroundcolor="#7fccde" onClick={onSubmitHandler}>
          회원가입
        </StBtnSubmit>
        <Link to={"/"}>
          <StBtnCancel backgroundcolor="#fa5a5a">취소</StBtnCancel>
        </Link>
      </div>
    </StSignupContainer>
  );
}
export default Signup;

const StSignupContainer = styled.div`
  max-width: 500px;
  margin: 15px auto;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex-direction: column;
  border: 3px solid black;
  /* Modal styles */
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
`;
// const StBtn = styled.button`
//   margin-right: 8px;
//   background-color: #da3238;
//   border-color: #da3238;
//   color: white;
//   font-size: 13px;
//   font-weight: bold;
//   border: none;
//   box-shadow: none;
//   border-radius: 0;
//   width: 90px;
//   height: 45px;
//   &:active {
//     filter: brightness(0.9);
//   }
// `;

const StBtnSubmit = styled.button`
  margin-right: 8px;
  background-color: #da3238;
  border-color: #da3238;
  color: white;
  font-size: 13px;
  font-weight: bold;
  border: none;
  box-shadow: none;
  border-radius: 0;
  width: 90px;
  height: 45px;
  &:active {
    filter: brightness(0.9);
  }
`;

const StBtnCancel = styled(StBtnSubmit)`
  margin-right: 8px;
  background-color: white;
  color: #222;
  border: 2px solid #d4d4d4;
`;

const StAlertBox = styled.div`
  color: tomato;
  font-weight: bold;
`;
