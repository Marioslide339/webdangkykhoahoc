import { Course } from "./types";

export const DEFAULT_COURSES: Course[] = [
  {
    id: "course-1",
    title: "KHÓA HỌC THIẾT KẾ BÀI GIẢNG E-LEARNING TRÊN ISPRING SUITE 11",
    subtitle: "Xây dựng bài giảng tương tác chuẩn quốc tế cho mọi cấp học",
    category: "Lớp học Tương tác",
    description: "Nắm vững trọn bộ công cụ iSpring Suite 11 để đóng gói bài giảng chuẩn E-Learning SCORM/HTML5, tạo hệ thống câu hỏi trắc nghiệm tương tác, hoạt cảnh đóng vai và nâng cao trải nghiệm tự học cho học sinh sinh viên các cấp.",
    duration: "10 giờ học",
    level: "Cơ bản",
    rating: 4.9,
    studentsCount: 1550,
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
    modules: [
      {
        title: "Chương 1: Khởi động cùng iSpring Suite 11",
        description: "Làm quen giao diện và cách tích hợp bài giảng trực tiếp vào Microsoft PowerPoint cực kỳ tối ưu.",
        lessons: [
          {
            title: "Bài 1.1: Cài đặt và tích hợp iSpring Suite vào PowerPoint",
            description: "Hướng dẫn cài đặt nhanh chóng và tối ưu hóa hệ thanh công cụ thiết kế học liệu.",
            duration: "12 phút"
          },
          {
            title: "Bài 1.2: Thiết kế Quizzes (Bộ câu hỏi tương tác nhiều lựa chọn)",
            description: "Cách tạo câu hỏi trắc nghiệm, điền khuyết, ghép nối hình ảnh, âm thanh chuẩn sư phạm.",
            duration: "20 phút"
          }
        ]
      },
      {
        title: "Chương 2: Thiết kế slide tương tác nâng cao (Interaction Studio)",
        description: "Tạo các chuyển động học trình, dòng thời gian lịch sử và sơ đồ khám phá trực quan.",
        lessons: [
          {
            title: "Bài 2.1: Tạo kịch bản phân nhánh nhập vai (Role-play)",
            description: "Thiết kế kịch bản xử lý tình huống thực tế giúp học viên rèn luyện tư duy phản biện.",
            duration: "15 phút"
          }
        ]
      }
    ]
  },
  {
    id: "course-2",
    title: "KHÓA HỌC ỨNG DỤNG AI VÀO GIẢNG DẠY",
    subtitle: "Trợ lý ảo thông minh đồng hành cùng giáo viên, giảng viên thế hệ số",
    category: "Trí tuệ nhân tạo",
    description: "Khám phá cách sử dụng trí tuệ nhân tạo (Generative AI) để tự động soạn giáo án chi tiết theo chuẩn, lấy ý tưởng bài giảng độc đáo, sinh đề trắc nghiệm phân hóa và nâng cao năng suất đứng lớp.",
    duration: "8 giờ học",
    level: "Trung cấp",
    rating: 5.0,
    studentsCount: 1980,
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc555e?q=80&w=600&auto=format&fit=crop",
    modules: [
      {
        title: "Chương 1: Soạn giáo án và đề thi tự động bằng AI",
        description: "Sử dụng các mô hình ngôn ngữ lớn để lập dàn ý bài dạy chất lượng và thiết kế bài kiểm tra.",
        lessons: [
          {
            title: "Bài 1.1: Thiết lập Prompt soạn bài giảng chuẩn khung năng lực",
            description: "Tận dụng AI để lên kế hoạch bài dạy chi tiết (giáo án), xác định mục tiêu kiến thức và kỹ năng.",
            duration: "15 phút"
          },
          {
            title: "Bài 1.2: Biên soạn ngân hàng câu hỏi ôn tập phân hóa",
            description: "Tự động thiết lập trò chơi đố vui học thuật, câu hỏi tư duy logic phân cấp từ dễ đến khó.",
            duration: "10 phút"
          }
        ]
      }
    ]
  },
  {
    id: "course-3",
    title: "KHÓA HỌC SỬ DỤNG AI TẠO APP NÂNG CAO",
    subtitle: "Tự tay sáng tạo ứng dụng học tập, ôn tập trực tuyến không cần viết mã",
    category: "Ứng dụng thông minh",
    description: "Sử dụng sức mạnh của AI thế hệ mới để kiến tạo các ứng dụng kiểm tra kiến thức nhanh, bảng tra cứu ngữ pháp, từ điển thuật ngữ hoặc mini-game học tập chạy mượt mà trên di động.",
    duration: "14 giờ học",
    level: "Nâng cao",
    rating: 4.8,
    studentsCount: 1120,
    imageUrl: "https://images.unsplash.com/photo-1596495578065-6e0763fa1141?q=80&w=600&auto=format&fit=crop",
    modules: [
      {
        title: "Chương 1: Nền tảng No-code kết hợp Sức mạnh AI",
        description: "Lập sơ đồ tư duy ứng dụng học tập tương thích cho học sinh sinh viên.",
        lessons: [
          {
            title: "Bài 1.1: Thiết lập màn hình tương tác thông minh",
            description: "Cách kết xuất giao diện rực rỡ, tích hợp hộp thoại AI hỗ trợ giải đáp trực tuyến.",
            duration: "25 phút"
          },
          {
            title: "Bài 1.2: Xuất bản và phân phối sản phẩm phần mềm tiện ích",
            description: "Đóng gói đường link gửi ngay cho người học thực hiện khảo sát, đo lường tiến độ.",
            duration: "18 phút"
          }
        ]
      }
    ]
  },
  {
    id: "course-4",
    title: "KHÓA HỌC THIẾT KẾ TRÊN CANVA TỪ CƠ BẢN ĐẾN NÂNG CAO",
    subtitle: "Mỹ thuật số chuyên nghiệp - Thiết kế bài trình chiếu, sơ đồ tư duy và tài liệu thu hút",
    category: "Mỹ thuật & Thiết kế",
    description: "Làm chủ bộ công cụ Canva Giáo Dục để thiết kế hệ thống slides giảng dạy, sơ đồ tư duy trực quan (Mindmap), infographics tổng hợp kiến thức và các mẫu phiếu học tập (worksheet) chuyên nghiệp.",
    duration: "12 giờ học",
    level: "Cơ bản",
    rating: 4.9,
    studentsCount: 2450,
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop",
    modules: [
      {
        title: "Chương 1: Tư duy bố cục và phối màu trong giáo dục số",
        description: "Ứng dụng các nguyên lý thị giác học đường, kết hợp font chữ tiếng Việt chuẩn hóa.",
        lessons: [
          {
            title: "Bài 1.1: Thiết kế slide bài giảng trực quan, tinh gọn và ấn tượng",
            description: "Cấu trúc bố cục ảnh nền rực rỡ, nhấn mạnh thông điệp cốt lõi tránh gây xao nhãng.",
            duration: "15 phút"
          },
          {
            title: "Bài 1.2: Thiết kế Infographics tổng hợp công thức kiến thức",
            description: "Lồng ghép biểu đồ minh họa thông tin giúp học viên ghi nhớ bài học lâu hơn.",
            duration: "20 phút"
          }
        ]
      }
    ]
  },
  {
    id: "course-5",
    title: "KHÓA HỌC THIẾT KẾ BÀI GIẢNG TRÊN POWERPOINT",
    subtitle: "Kỹ thuật hiệu ứng Morph chuyển cảnh & hoạt họa chuyên nghiệp bài bản",
    category: "Lớp học Tương tác",
    description: "Biến slide tĩnh truyền thống thành các bài thuyết trình di động sinh động nhờ hiệu ứng Morph chuyển cảnh mượt mà, kỹ thuật kích hoạt (trigger) trò chơi đố vui thông minh và lật tranh bí ẩn lôi cuốn người học.",
    duration: "10 giờ học",
    level: "Trung cấp",
    rating: 4.9,
    studentsCount: 3100,
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop",
    modules: [
      {
        title: "Chương 1: Làm chủ hiệu ứng Morph và Kỹ xảo trình diễn",
        description: "Đột phá tư duy thiết kế bài giảng động, liên kết giữa các đối tượng khoa học trực quan.",
        lessons: [
          {
            title: "Bài 1.1: Thiết kế sơ đồ mô phỏng nguyên lý khoa học",
            description: "Ứng dụng Morph mô phỏng chuyển động tuần hoàn, quá trình biến đổi sinh học rõ nét.",
            duration: "22 phút"
          },
          {
            title: "Bài 1.2: Kỹ thuật Trigger tạo mini-game giải cứu học tập",
            description: "Xây dựng trò chơi lựa chọn từ vựng, tính toán nhanh kích hoạt điểm số tức thời trên màn chiếu.",
            duration: "15 phút"
          }
        ]
      }
    ]
  },
  {
    id: "course-6",
    title: "KHÓA HỌC DỰNG PHIM HOẠT HÌNH 2D TRÊN PHẦN MỀM ANIMIZ ANIMATION MAKER",
    subtitle: "Chế tác bài giảng video hoạt họa dạng 2D sinh động, hấp dẫn học viên",
    category: "Hoạt hình & Sáng tạo",
    description: "Sử dụng phần mềm chuyên nghiệp Animiz để xây dựng bài giảng kể chuyện hoạt hình chân thực, ghép nối các nhân vật ảo mô phỏng quy trình dịch vụ, bài giảng kỹ năng cuộc sống đầy cảm mến.",
    duration: "16 giờ học",
    level: "Nâng cao",
    rating: 4.7,
    studentsCount: 1420,
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
    modules: [
      {
        title: "Chương 1: Xây dựng bối cảnh và chuyển động nhân vật",
        description: "Thêm nhân vật ảo, sắp xếp các hành động nói, chỉ bảng giảng giải và điều phối máy ảnh.",
        lessons: [
          {
            title: "Bài 1.1: Tạo hoạt cảnh di chuyển và cử chỉ của nhân vật",
            description: "Tích hợp biểu cảm nói cười tự nhiên, phối hợp động tác chỉ cử chỉ tay tinh tế.",
            duration: "25 phút"
          },
          {
            title: "Bài 1.2: Lồng ghép âm thanh thuyết minh và nhạc nền",
            description: "Bí quyết tinh chỉnh bộ lọc âm giọng nói sắc nét, chèn nhạc đệm vui nhộn thu hút học tập.",
            duration: "20 phút"
          }
        ]
      }
    ]
  }
];
