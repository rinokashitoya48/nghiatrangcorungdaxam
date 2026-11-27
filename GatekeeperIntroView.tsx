import React from 'react';
import { RealmId } from '../data/cemeteryData';
import { GothicFilmGrainOverlay } from './GothicOrnaments';
import { SnowAndMistCanvas } from './SnowAndMistCanvas';

interface GatekeeperIntroViewProps {
  onBackToEntrance: () => void;
  onEnterRealm: (realm: RealmId) => void;
}

export const GatekeeperIntroView: React.FC<GatekeeperIntroViewProps> = ({
  onBackToEntrance,
  onEnterRealm,
}) => {
  return (
    <div className="relative min-h-screen bg-[#030304] text-[#e5e5e5]">
      {/* Đồng bộ lớp nhiễu hạt phim & bụi phấn cổ điển với màn hình ngoài và 2 trang rừng */}
      <GothicFilmGrainOverlay />

      {/* Hạt bụi tuyết lơ lửng nhẹ nhàng trên nền đen sâu Gothic */}
      <SnowAndMistCanvas
        snowIntensity="gentle"
        mistEnabled={false}
        spectralMotionEnabled={false}
      />

      {/* Khung trang Người Gác Cổng dùng Container Query (cqw) đồng bộ tỷ lệ 1:1 giữa Mobile & Web/Device */}
      <div className="relative z-10 mx-auto my-1.5 min-h-[calc(100vh-12px)] w-[calc(100%-4px)] max-w-[940px] overflow-hidden pb-[30cqw] [container-type:inline-size]">
        {/* 4 HOA VĂN GÓC BAROQUE ĐỐI XỨNG (w=27.4% như ref) */}
        <img
          src="/assets/aistudio/gothic_gatekeeper_corner.png?v=1"
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="gothic-chalk-print pointer-events-none absolute top-0 left-0 z-20 h-auto w-[27.4%] -scale-x-100 -scale-y-100 object-contain opacity-95 select-none"
        />
        <img
          src="/assets/aistudio/gothic_gatekeeper_corner.png?v=1"
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="gothic-chalk-print pointer-events-none absolute top-0 right-0 z-20 h-auto w-[27.4%] -scale-y-100 object-contain opacity-95 select-none"
        />
        <img
          src="/assets/aistudio/gothic_gatekeeper_corner.png?v=1"
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="gothic-chalk-print pointer-events-none absolute bottom-0 left-0 z-20 h-auto w-[27.4%] -scale-x-100 object-contain opacity-95 select-none"
        />
        <img
          src="/assets/aistudio/gothic_gatekeeper_corner.png?v=1"
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="gothic-chalk-print pointer-events-none absolute right-0 bottom-0 z-20 h-auto w-[27.4%] object-contain opacity-95 select-none"
        />

        {/* PHẦN ĐẦU TRANG: ĐÈN CHÙM GOTHIC 3 NHỊP + TIÊU ĐỀ "Người gác cổng" + KHỔ MỞ ĐẦU */}
        <header className="relative z-10 w-full pt-[0.5cqw]">
          {/* Hình đèn chùm 3 nhịp + dây xích + thơ mờ bên phải (Ref x=24.5%..93.1%, w=68.6%) */}
          <img
            src="/assets/aistudio/gothic_gatekeeper_chandeliers.png?v=1"
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
            className="gothic-chalk-print ml-[24.5%] block h-auto w-[68.6%] object-contain opacity-95 select-none"
          />

          {/* Tiêu đề "Gatekeeper" đồng bộ font A Gothique Time & hiệu ứng khắc phấn với Fairy Tale / Folklore / Chronicles */}
          <h1 className="font-gothique gothic-time-chalk absolute top-[65.5%] left-[6.5%] overflow-visible py-[0.5cqw] text-[16.4cqw] leading-[1.06] font-normal tracking-[0.03em] whitespace-nowrap">
            Gatekeeper
          </h1>

          {/* Hai câu mở đầu đặt ngay dưới tiêu đề, nằm gọn bên trái mũi đèn chùm phải */}
          <p className="font-literary gothic-text-chalk absolute bottom-[0.5%] left-[6.5%] text-left text-[3cqw] leading-[1.38] font-normal text-[#c4c4ce]">
            <span className="block">ta đợi tình,</span>
            <span className="block">cũng chẳng lạ.</span>
          </p>
        </header>

        {/* PHẦN VĂN BẢN GIỚI THIỆU — CANH LỀ 2 BÊN (JUSTIFIED) CHUẨN REF & TỶ LỆ 1:1 */}
        <main className="font-literary gothic-text-chalk relative z-10 mx-auto mt-[3.6cqw] px-[6.5%] text-[3cqw] leading-[1.48] font-normal text-[#c4c4ce]">
          <div
            className="space-y-[4.2cqw]"
            style={{ textAlign: 'justify', textAlignLast: 'left' }}
          >
            <p className="text-justify">
              có những đêm ta ủ trong cõi mộng chênh vênh đến độ cuộc đời lên
              men và chua chát, tình thường cố len qua kẽ mi sắp sửa chẳng còn
              run rẩy để dang tay ôm lấy thân ta rã rời. lòng tình rộng lắm,
              rộng tựa biển khơi, và dẫu ta đã lặn xuống tận đáy đại dương thì
              ta cũng chỉ là một trong số những sinh vật phù du mong manh, non
              yếu, mà phù du thì dễ lụi tàn.
            </p>

            <p className="text-left">
              <span className="block">và ta,</span>
              <span className="block">
                đã lụi tàn chỉ bởi đợi tình ghé đến.
              </span>
            </p>

            <div
              aria-hidden="true"
              className="py-[0.5cqw] text-left text-[3.1cqw] leading-none text-[#d0d0da]"
            >
              •
            </div>

            <p className="text-justify">
              ta hay ước mình là cá voi xanh, để có thể gom một bụng hạnh phúc
              khổng lồ mà chẳng sợ trượt khỏi vòng tay nhỏ bé, còn sầu đau thì
              trả về bầu trời cao lồng lộng bằng đài phun nước trên đỉnh đầu.
            </p>

            <p className="text-justify">
              hay dòng sông hiền hòa ăm ắp phù sa để những hạt giống hỉ hoan ta
              từng gieo trồng nảy mầm và tươi tốt chừng có thể. hoặc thiên hà
              mênh mang nơi hàng vạn vì sao lấp lánh đã chọn làm nhà.
            </p>

            <p className="text-justify">
              hoặc miễn sao, miễn sao ta không héo hon sức chịu, không rơi vào
              thống khổ vô biên vô thoát để rồi oằn mình đợi tình rọi chiếu ánh
              dương vào hồn ta và vỗ về những giọt nước mắt vỡ òa như con lụt
              khi cuối cùng tình cũng đến.
            </p>

            <p className="text-left">
              <span className="block">ta đã luôn hi vọng tình đến.</span>
              <span className="block">đã luôn.</span>
            </p>

            <div
              aria-hidden="true"
              className="py-[0.5cqw] text-left text-[3.1cqw] leading-none text-[#d0d0da]"
            >
              •
            </div>

            <p className="text-justify">
              xin chào, hãy để mình mạn phép gọi cậu là &quot;tình&quot;, tình
              của mình.
            </p>

            <p className="text-justify">
              mình là đông, yên hay bất kỳ tên nào tình thích gọi. hiện tại mình
              đang gác cổng &quot;nơi triền đông đượm yên&quot; và &quot;bóng
              nàng ninh ních tim tôi&quot;. tình có thể ghé thăm nghĩa trang này
              khi rảnh rỗi và nếu được, xin tình hãy nán lại tim mình vài phút
              cho ngòi bút này được viết về tình, về những bồi hồi hay thăng
              trầm đắn đo giữa cung đời vào biên niên sử trước khi chuyến tàu
              xăm xa đưa tình trở về nơi thuộc về.
            </p>

            <p className="text-justify">
              mình sẽ lấy làm cảm kích đấy, mong tình, thân yêu.
            </p>
          </div>

          {/* 3 CỔNG ĐIỀU HƯỚNG BÊN DƯỚI TEXT GIỚI THIỆU — TRÌNH BÀY ĐỒNG BỘ 100% VỚI 2 TRANG RỪNG */}
          <nav
            aria-label="Điều hướng từ trang Người gác cổng"
            className="mt-[10.5cqw] flex w-full flex-col items-center justify-center gap-[4.2cqw]"
          >
            {/* 1. CỔNG NGHĨA TRANG */}
            <button
              type="button"
              onClick={onBackToEntrance}
              className="group flex cursor-pointer flex-col items-center justify-center focus:outline-none"
            >
              <span className="font-serif-title gothic-text-chalk flex items-center gap-[2.5cqw] text-[3.6cqw] leading-none font-normal tracking-[0.14em] whitespace-nowrap text-[#bcbcc6] uppercase transition-all duration-300 group-hover:tracking-[0.17em] group-hover:text-[#e2e2ec]">
                <span
                  aria-hidden="true"
                  className="text-[0.65em] text-[#a4a4ae] transition-transform duration-300 group-hover:scale-125 group-hover:text-[#e2e2ec]"
                >
                  ✦
                </span>
                <span>CỔNG NGHĨA TRANG</span>
                <span
                  aria-hidden="true"
                  className="text-[0.65em] text-[#a4a4ae] transition-transform duration-300 group-hover:scale-125 group-hover:text-[#e2e2ec]"
                >
                  ✦
                </span>
              </span>
              <img
                src="/assets/aistudio/gothic_nav_divider.png?v=5"
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                className="mt-[1.6cqw] h-auto w-[43.5cqw] object-contain opacity-88 transition-all duration-300 group-hover:w-[47cqw] group-hover:opacity-100"
              />
            </button>

            {/* 2. RỪNG CỔ TÍCH */}
            <button
              type="button"
              onClick={() => onEnterRealm('rung-co-tich')}
              className="group flex cursor-pointer flex-col items-center justify-center focus:outline-none"
            >
              <span className="font-serif-title gothic-text-chalk flex items-center gap-[2.5cqw] text-[3.6cqw] leading-none font-normal tracking-[0.14em] whitespace-nowrap text-[#bcbcc6] uppercase transition-all duration-300 group-hover:tracking-[0.17em] group-hover:text-[#e2e2ec]">
                <span
                  aria-hidden="true"
                  className="text-[0.65em] text-[#a4a4ae] transition-transform duration-300 group-hover:scale-125 group-hover:text-[#e2e2ec]"
                >
                  ✦
                </span>
                <span>RỪNG CỔ TÍCH</span>
                <span
                  aria-hidden="true"
                  className="text-[0.65em] text-[#a4a4ae] transition-transform duration-300 group-hover:scale-125 group-hover:text-[#e2e2ec]"
                >
                  ✦
                </span>
              </span>
              <img
                src="/assets/aistudio/gothic_nav_divider.png?v=5"
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                className="mt-[1.6cqw] h-auto w-[43.5cqw] object-contain opacity-88 transition-all duration-300 group-hover:w-[47cqw] group-hover:opacity-100"
              />
            </button>

            {/* 3. RỪNG ĐIỂN TÍCH */}
            <button
              type="button"
              onClick={() => onEnterRealm('rung-ben-phai')}
              className="group flex cursor-pointer flex-col items-center justify-center focus:outline-none"
            >
              <span className="font-serif-title gothic-text-chalk flex items-center gap-[2.5cqw] text-[3.6cqw] leading-none font-normal tracking-[0.14em] whitespace-nowrap text-[#bcbcc6] uppercase transition-all duration-300 group-hover:tracking-[0.17em] group-hover:text-[#e2e2ec]">
                <span
                  aria-hidden="true"
                  className="text-[0.65em] text-[#a4a4ae] transition-transform duration-300 group-hover:scale-125 group-hover:text-[#e2e2ec]"
                >
                  ✦
                </span>
                <span>RỪNG ĐIỂN TÍCH</span>
                <span
                  aria-hidden="true"
                  className="text-[0.65em] text-[#a4a4ae] transition-transform duration-300 group-hover:scale-125 group-hover:text-[#e2e2ec]"
                >
                  ✦
                </span>
              </span>
              <img
                src="/assets/aistudio/gothic_nav_divider.png?v=5"
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                className="mt-[1.6cqw] h-auto w-[43.5cqw] object-contain opacity-88 transition-all duration-300 group-hover:w-[47cqw] group-hover:opacity-100"
              />
            </button>
          </nav>
        </main>
      </div>
    </div>
  );
};
